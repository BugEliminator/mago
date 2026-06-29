"use client";

import { useMemo } from "react";
import Picker from "react-mobile-picker";
import type { PickerValue } from "react-mobile-picker";
import {
  WheelWrapper,
  WheelColumnHeader,
  WheelColumn,
} from "./PickerWheel.style";
import WheelPickerScrollShell from "./WheelPickerScrollShell";
import { PICKER_ITEM_HEIGHT } from "./useWheelStepPicker";

type TimePickerValue = {
  hour: string;
  minute: string;
};

type BirthTimeFieldProps = {
  /** `HH:MM` 또는 빈 문자열 */
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  id?: string;
};

const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

/** `HH:MM` → TimePickerValue. 없으면 `{ hour: "12", minute: "00" }` */
function toPickerValue(raw: string): TimePickerValue {
  const [h, m] = raw.split(":");
  if (h !== undefined && m !== undefined) {
    return {
      hour: h.padStart(2, "0"),
      minute: m.substring(0, 2).padStart(2, "0"),
    };
  }
  return { hour: "12", minute: "00" };
}

/**
 * 태어난 시간 휠 — react-mobile-picker 기반
 */
export default function BirthTimeField({
  value,
  onChange,
  disabled = false,
  id,
}: BirthTimeFieldProps) {
  const pickerVal = useMemo(() => toPickerValue(value), [value]);

  const handleChange = (next: PickerValue, _key: string) => {
    const v = next as TimePickerValue;
    onChange(`${v.hour}:${v.minute}`);
  };

  return (
    <div id={id} aria-label="태어난 시간 선택">
      <WheelWrapper
        style={disabled ? { opacity: 0.5, pointerEvents: "none" } : undefined}
      >
        <WheelColumn>
          <WheelColumnHeader>시</WheelColumnHeader>
          <WheelPickerScrollShell
            items={HOURS}
            value={pickerVal.hour}
            disabled={disabled}
            onValueChange={(hour) =>
              handleChange({ ...pickerVal, hour } as PickerValue, "hour")
            }
          >
            <Picker
              value={pickerVal}
              onChange={handleChange}
              height={108}
              itemHeight={PICKER_ITEM_HEIGHT}
              wheelMode="off"
            >
              <Picker.Column name="hour">
                {HOURS.map((h) => (
                  <Picker.Item key={h} value={h}>
                    {({ selected }) => (
                      <span
                        style={{
                          color: selected ? "#d4af37" : "#4a4e6a",
                          fontWeight: selected ? 700 : 400,
                          fontSize: "0.875rem",
                        }}
                      >
                        {parseInt(h, 10)}시
                      </span>
                    )}
                  </Picker.Item>
                ))}
              </Picker.Column>
            </Picker>
          </WheelPickerScrollShell>
        </WheelColumn>

        <WheelColumn>
          <WheelColumnHeader>분</WheelColumnHeader>
          <WheelPickerScrollShell
            items={MINUTES}
            value={pickerVal.minute}
            disabled={disabled}
            onValueChange={(minute) =>
              handleChange({ ...pickerVal, minute } as PickerValue, "minute")
            }
          >
            <Picker
              value={pickerVal}
              onChange={handleChange}
              height={108}
              itemHeight={PICKER_ITEM_HEIGHT}
              wheelMode="off"
            >
              <Picker.Column name="minute">
                {MINUTES.map((m) => (
                  <Picker.Item key={m} value={m}>
                    {({ selected }) => (
                      <span
                        style={{
                          color: selected ? "#d4af37" : "#4a4e6a",
                          fontWeight: selected ? 700 : 400,
                          fontSize: "0.875rem",
                        }}
                      >
                        {parseInt(m, 10)}분
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
