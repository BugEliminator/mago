-- 카카오 전용 auth.users의 kakao identity를 기존 이메일 회원으로 옮긴 뒤 임시 유저를 삭제한다.
-- service_role RPC 전용. anon/authenticated는 실행할 수 없다.

CREATE OR REPLACE FUNCTION public.link_kakao_identity_to_user(
  source_user_id uuid,
  target_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF source_user_id IS NULL OR target_user_id IS NULL THEN
    RAISE EXCEPTION 'user id is required';
  END IF;

  IF source_user_id = target_user_id THEN
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = source_user_id
  ) THEN
    RAISE EXCEPTION 'source user already has a MAGO profile';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = target_user_id
  ) THEN
    RAISE EXCEPTION 'target user has no MAGO profile';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM auth.identities
    WHERE user_id = target_user_id
      AND provider = 'kakao'
  ) THEN
    RAISE EXCEPTION 'target user already has a kakao identity';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM auth.identities
    WHERE user_id = source_user_id
      AND provider <> 'kakao'
  ) THEN
    RAISE EXCEPTION 'source user has non-kakao identities';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM auth.identities
    WHERE user_id = source_user_id
      AND provider = 'kakao'
  ) THEN
    RAISE EXCEPTION 'source user has no kakao identity';
  END IF;

  UPDATE auth.identities
  SET
    user_id = target_user_id,
    updated_at = now()
  WHERE user_id = source_user_id
    AND provider = 'kakao';

  UPDATE auth.users
  SET
    raw_app_meta_data = jsonb_set(
      COALESCE(raw_app_meta_data, '{}'::jsonb),
      '{providers}',
      (
        SELECT jsonb_agg(DISTINCT element)
        FROM jsonb_array_elements(
          COALESCE(raw_app_meta_data->'providers', '[]'::jsonb)
          || '["kakao"]'::jsonb
        ) AS element
      )
    ),
    updated_at = now()
  WHERE id = target_user_id;

  DELETE FROM auth.users
  WHERE id = source_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.link_kakao_identity_to_user(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.link_kakao_identity_to_user(uuid, uuid) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.link_kakao_identity_to_user(uuid, uuid) TO service_role;
