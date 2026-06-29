"use client";

import { useEffect, useMemo } from "react";
import Picker from "react-mobile-picker";
import type { PickerValue } from "react-mobile-picker";
import { formatDateOnlyLocal, parseDateOnlyLocal } from "@/lib/dateOnly";
import {
  WheelWrapper,
  WheelColumnHeader,
  WheelColumn,
} from "./PickerWheel.style";
import WheelPickerScrollShell from "./WheelPickerScrollShell";
import { PICKER_ITEM_HEIGHT } from "./useWheelStepPicker";

type DatePickerValue = {
  year: string;
  month: string;
  day: string;
};

type BirthDateFieldProps = {
  /** `YYYY-MM-DD` 또는 빈 문자열 */
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  id?: string;
};

const THIS_YEAR = new Date().getFullYear();

/** 올해 ~ 100년 전 */
const YEARS = Array.from({ length: 100 }, (_, i) => String(THIS_YEAR - i));
/** 1 ~ 12 (두 자리 패딩) */
const MONTHS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

/** 해당 연·월의 마지막 날 계산 */
function daysInMonth(year: string, month: string): number {
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  if (isNaN(y) || isNaN(m)) {
    return 31;
  }
  return new Date(y, m, 0).getDate();
}

/** `YYYY-MM-DD` → DatePickerValue 변환. 없으면 30년 전 1월 1일 기본값 */
function toPickerValue(raw: string): DatePickerValue {
  const d = parseDateOnlyLocal(raw);
  if (d) {
    return {
      year: String(d.getFullYear()),
      month: String(d.getMonth() + 1).padStart(2, "0"),
      day: String(d.getDate()).padStart(2, "0"),
    };
  }
  return {
    year: String(THIS_YEAR - 30),
    month: "01",
    day: "01",
  };
}

/**
 * 생년월일 휠 — react-mobile-picker 기반
 */
export default function BirthDateField({
  value,
  onChange,
  disabled = false,
  id,
}: BirthDateFieldProps) {
  const pickerVal = toPickerValue(value);

  /** 선택한 연·월에 따른 일 목록 */
  const days = useMemo(() => {
    const max = daysInMonth(pickerVal.year, pickerVal.month);
    return Array.from({ length: max }, (_, i) =>
      String(i + 1).padStart(2, "0")
    );
  }, [pickerVal.year, pickerVal.month]);

  /** 날이 말일 초과 시 클램프 */
  useEffect(() => {
    const max = daysInMonth(pickerVal.year, pickerVal.month);
    const d = parseInt(pickerVal.day, 10);
    if (d > max) {
      onChange(
        formatDateOnlyLocal(
          new Date(
            parseInt(pickerVal.year, 10),
            parseInt(pickerVal.month, 10) - 1,
            max
          )
        )
      );
    }
  }, [pickerVal.year, pickerVal.month, pickerVal.day, onChange]);

  const handleChange = (next: PickerValue) => {
    const v = next as DatePickerValue;
    const y = parseInt(v.year, 10);
    const m = parseInt(v.month, 10);
    const d = Math.min(parseInt(v.day, 10), daysInMonth(v.year, v.month));
    onChange(formatDateOnlyLocal(new Date(y, m - 1, d)));
  };

  return (
    <div id={id} aria-label="생년월일 선택">
      <WheelWrapper
        style={disabled ? { opacity: 0.5, pointerEvents: "none" } : undefined}
      >
        <WheelColumn>
          <WheelColumnHeader>연도</WheelColumnHeader>
          <WheelPickerScrollShell
            items={YEARS}
            value={pickerVal.year}
            disabled={disabled}
            onValueChange={(year) =>
              handleChange({ ...pickerVal, year } as PickerValue)
            }
          >
            <Picker
              value={pickerVal}
              onChange={handleChange}
              height={108}
              itemHeight={PICKER_ITEM_HEIGHT}
              wheelMode="off"
            >
              <Picker.Column name="year">
                {YEARS.map((y) => (
                  <Picker.Item key={y} value={y}>
                    {({ selected }) => (
                      <span
                        style={{
                          color: selected ? "#d4af37" : "#4a4e6a",
                          fontWeight: selected ? 700 : 400,
                          fontSize: "0.875rem",
                        }}
                      >
                        {y}년
                      </span>
                    )}
                  </Picker.Item>
                ))}
              </Picker.Column>
            </Picker>
          </WheelPickerScrollShell>
        </WheelColumn>

        <WheelColumn>
          <WheelColumnHeader>월</WheelColumnHeader>
          <WheelPickerScrollShell
            items={MONTHS}
            value={pickerVal.month}
            disabled={disabled}
            onValueChange={(month) =>
              handleChange({ ...pickerVal, month } as PickerValue)
            }
          >
            <Picker
              value={pickerVal}
              onChange={handleChange}
              height={108}
              itemHeight={PICKER_ITEM_HEIGHT}
              wheelMode="off"
            >
              <Picker.Column name="month">
                {MONTHS.map((m) => (
                  <Picker.Item key={m} value={m}>
                    {({ selected }) => (
                      <span
                        style={{
                          color: selected ? "#d4af37" : "#4a4e6a",
                          fontWeight: selected ? 700 : 400,
                          fontSize: "0.875rem",
                        }}
                      >
                        {parseInt(m, 10)}월
                      </span>
                    )}
                  </Picker.Item>
                ))}
              </Picker.Column>
            </Picker>
          </WheelPickerScrollShell>
        </WheelColumn>

        <WheelColumn>
          <WheelColumnHeader>일</WheelColumnHeader>
          <WheelPickerScrollShell
            items={days}
            value={pickerVal.day}
            disabled={disabled}
            onValueChange={(day) =>
              handleChange({ ...pickerVal, day } as PickerValue)
            }
          >
            <Picker
              value={pickerVal}
              onChange={handleChange}
              height={108}
              itemHeight={PICKER_ITEM_HEIGHT}
              wheelMode="off"
            >
              <Picker.Column name="day">
                {days.map((d) => (
                  <Picker.Item key={d} value={d}>
                    {({ selected }) => (
                      <span
                        style={{
                          color: selected ? "#d4af37" : "#4a4e6a",
                          fontWeight: selected ? 700 : 400,
                          fontSize: "0.875rem",
                        }}
                      >
                        {parseInt(d, 10)}일
                      </span>
                    )}
                  </Picker.Item>
                ))}
              </Picker.Column>
            </Picker>
          </WheelPickerScrollShell>
        </WheelColumn>
      </WheelWrapper>
    </div>
  );
}
