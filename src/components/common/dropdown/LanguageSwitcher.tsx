"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, Languages } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import {
  getLanguageDisplayName,
  LANGUAGE_OPTIONS,
  resolveAvailableLanguage,
  type LanguageOption,
} from "@/lib/languageOptions";
import { useLanguageStore, type LanguageCode } from "@/stores/languageStore";
import {
  LangSwitcherWrap,
  LangTriggerButton,
  LangDropdownPanel,
  LangDropdownHeader,
  LangDropdownLabel,
  LangDropdownList,
  LangOptionButton,
  LangOptionLeft,
  LangActiveDot,
  LangNameText,
  LangComingSoonBadge,
  type LangSwitcherVariant,
} from "@/components/common/dropdown/LanguageSwitcher.style";

type LanguageSwitcherProps = {
  /** header: GNB compact / form: 프로필 full-width 다크 */
  variant?: LangSwitcherVariant;
  /** 로그인된 유저 ID — null 이면 localStorage + Zustand 만 업데이트 */
  userId?: string | null;
  /** 선택 시 토스트 노출 여부 (기본 true) */
  showToast?: boolean;
  /**
   * Controlled 모드 — 현재 선택값
   * 전달하면 Zustand/localStorage 대신 이 값을 표시용으로 사용
   */
  value?: LanguageCode;
  /**
   * Controlled 모드 — 선택 시 콜백 (Zustand/DB 업데이트 없이 draft만 변경)
   * value와 세트로 사용
   */
  onChange?: (code: LanguageCode) => void;
};

/**
 * 언어 스위처 — 헤더·프로필 공용
 *
 * Uncontrolled (헤더):
 *   - 선택 즉시 Zustand + localStorage(+로그인 시 DB)
 *
 * Controlled (프로필 폼):
 *   - value/onChange 전달 시 draft state만 변경
 *   - Zustand/DB는 건드리지 않음 (저장 버튼에서 처리)
 */
export default function LanguageSwitcher({
  variant = "header",
  userId = null,
  showToast = true,
  value,
  onChange,
}: LanguageSwitcherProps) {
  const { language: storeLanguage, setLanguage } = useLanguageStore();
  const isControlled = value !== undefined && onChange !== undefined;
  const rawLanguage: LanguageCode = isControlled ? value : storeLanguage;
  const displayLanguage = resolveAvailableLanguage(rawLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /** 미지원 언어(en 등) 저장값 → 한국어로 정규화 */
  useEffect(() => {
    if (isControlled) return;
    const resolved = resolveAvailableLanguage(storeLanguage);
    if (resolved !== storeLanguage) {
      setLanguage(resolved);
    }
  }, [isControlled, setLanguage, storeLanguage]);

  /** 외부 클릭 시 드롭다운 닫기 */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (option: LanguageOption) => {
    if (!option.isAvailable) return;
    setIsOpen(false);

    if (isControlled) {
      /** 프로필 폼 draft — Zustand/DB 건드리지 않음 */
      onChange(option.code);
      return;
    }

    /** 헤더 uncontrolled — 즉시 Zustand + localStorage + DB */
    setLanguage(option.code);

    if (userId != null) {
      const { error } = await supabase
        .from("profiles")
        .update({ language: option.code })
        .eq("id", userId);

      if (error) {
        toast.error("언어 설정 저장에 실패했습니다.");
        return;
      }
    }

    if (showToast) {
      toast.success(`언어가 [${option.name}]로 설정되었습니다.`);
    }
  };

  const panelMotion =
    variant === "form"
      ? { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } }
      : { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 } };

  return (
    <LangSwitcherWrap ref={dropdownRef} $variant={variant}>
      <LangTriggerButton
        type="button"
        $open={isOpen}
        $variant={variant}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`언어 선택: ${getLanguageDisplayName(displayLanguage)}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {variant === "header" && <Languages size={14} />}
        <span>{getLanguageDisplayName(displayLanguage)}</span>
        {variant === "header" ? (
          <ChevronDown
            size={12}
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 200ms ease",
              flexShrink: 0,
            }}
          />
        ) : (
          <ChevronDown
            size={16}
            color="#5c5e72"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 200ms ease",
              flexShrink: 0,
            }}
          />
        )}
      </LangTriggerButton>

      {isOpen && (
        <LangDropdownPanel
          $variant={variant}
          initial={panelMotion.initial}
          animate={panelMotion.animate}
          transition={{ duration: 0.15 }}
        >
          <LangDropdownHeader>
            <LangDropdownLabel>Language / 言語</LangDropdownLabel>
          </LangDropdownHeader>

          <LangDropdownList role="listbox">
            {LANGUAGE_OPTIONS.map((opt) => {
              const isActive = displayLanguage === opt.code;
              return (
                <LangOptionButton
                  key={opt.code}
                  role="option"
                  aria-selected={isActive}
                  $active={isActive}
                  $available={opt.isAvailable}
                  disabled={!opt.isAvailable}
                  onClick={() => void handleSelect(opt)}
                >
                  <LangOptionLeft>
                    <LangActiveDot $active={isActive} />
                    <LangNameText $strikethrough={!opt.isAvailable}>
                      {opt.name}
                    </LangNameText>
                  </LangOptionLeft>

                  {isActive && opt.isAvailable && (
                    <Check size={14} color="#818cf8" strokeWidth={2.5} />
                  )}
                  {!opt.isAvailable && (
                    <LangComingSoonBadge>준비 중</LangComingSoonBadge>
                  )}
                </LangOptionButton>
              );
            })}
          </LangDropdownList>
        </LangDropdownPanel>
      )}
    </LangSwitcherWrap>
  );
}
