import { applyCoinTransaction } from "@/lib/server/applyCoinTransaction";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";
import type {
  SubmitTarotSessionReviewInput,
  SubmitTarotSessionReviewResult,
} from "@/types/tarotSessionDb";

/**
 * tarot_sessions 후기 저장 — has_reviewed=true, rating, review_content
 * 이미 후기가 있으면 거부(ALREADY_REVIEWED)
 */
export async function saveTarotSessionReviewToDb(
  input: SubmitTarotSessionReviewInput,
): Promise<SubmitTarotSessionReviewResult> {
  const { readingId, userId, rating, reviewContent } = input;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return {
      ok: false,
      code: "VALIDATION",
      message: "별점은 1~5 사이 정수여야 합니다.",
    };
  }

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Supabase Admin 설정 오류";
    return { ok: false, code: "ENV_MISSING", message };
  }

  const { data: existing, error: fetchError } = await admin
    .from("tarot_sessions")
    .select("id, has_reviewed")
    .eq("id", readingId)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError != null) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "리딩 세션을 찾을 수 없습니다.",
    };
  }

  if (existing == null) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "리딩 세션을 찾을 수 없습니다.",
    };
  }

  if (existing.has_reviewed === true) {
    return {
      ok: false,
      code: "ALREADY_REVIEWED",
      message: "이미 후기를 남긴 리딩입니다.",
    };
  }

  const { error: updateError } = await admin
    .from("tarot_sessions")
    .update({
      has_reviewed: true,
      rating,
      review_content: reviewContent,
    })
    .eq("id", readingId)
    .eq("user_id", userId);

  if (updateError != null) {
    return {
      ok: false,
      code: "UPDATE_FAILED",
      message: `후기 저장 실패: ${updateError.message}`,
    };
  }

  const coinResult = await applyCoinTransaction({
    userId,
    type: "EARN_REVIEW",
  });

  if (!coinResult.ok) {
    return {
      ok: false,
      code: "UPDATE_FAILED",
      message: `후기 보상 지급 실패: ${coinResult.message}`,
    };
  }

  return { ok: true };
}
