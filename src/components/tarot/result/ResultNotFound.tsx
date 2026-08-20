"use client";

import { SearchX } from "lucide-react";
import TarotDraftResumeModal from "@/components/tarot/TarotDraftResumeModal";
import TarotGuestEntryModal from "@/components/tarot/TarotGuestEntryModal";
import TarotReadingResumeModal from "@/components/tarot/TarotReadingResumeModal";
import { useTarotSetupEntry } from "@/hooks/useTarotSetupEntry";
import {
  Actions,
  Description,
  HomeLink,
  IconWrap,
  Panel,
  StartButton,
  Title,
  Wrap,
} from "./ResultNotFound.style";

const ICON_SIZE = 28;

/**
 * 결과 페이지 전용 404 — 없거나 더 이상 볼 수 없는 리딩
 */
export default function ResultNotFound() {
  const {
    requestTarotSetup,
    guestEntryOpen,
    readingResumeOpen,
    resumeOpen,
    handleGuestBrowse,
    handleGuestLogin,
    handleDismissGuestEntry,
    handleResumeReading,
    handleStartFreshFromReading,
    handleDismissReadingResume,
    handleResume,
    handleStartFresh,
    handleDismissResume,
  } = useTarotSetupEntry();

  return (
    <>
      {guestEntryOpen ? (
        <TarotGuestEntryModal
          onBrowse={handleGuestBrowse}
          onLogin={handleGuestLogin}
          onDismiss={handleDismissGuestEntry}
        />
      ) : null}
      {readingResumeOpen ? (
        <TarotReadingResumeModal
          onResume={handleResumeReading}
          onStartFresh={handleStartFreshFromReading}
          onDismiss={handleDismissReadingResume}
        />
      ) : null}
      {resumeOpen ? (
        <TarotDraftResumeModal
          onResume={handleResume}
          onStartFresh={handleStartFresh}
          onDismiss={handleDismissResume}
        />
      ) : null}

      <Wrap>
        <Panel>
          <IconWrap>
            <SearchX size={ICON_SIZE} aria-hidden />
          </IconWrap>
          <Title>이 운세 결과를 찾을 수 없어요</Title>
          <Description>
            주소가 잘못됐거나 더 이상 볼 수 없는 리딩일 수 있어요.
          </Description>
          <Actions>
            <HomeLink href="/">홈으로</HomeLink>
            <StartButton type="button" onClick={() => requestTarotSetup()}>
              타로 시작하기
            </StartButton>
          </Actions>
        </Panel>
      </Wrap>
    </>
  );
}
