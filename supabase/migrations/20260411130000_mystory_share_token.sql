-- mystory_sessions에 공유 토큰 컬럼 추가
-- share_token: NULL이면 비공개, UUID값이면 공개 공유 가능

ALTER TABLE mystory_sessions
  ADD COLUMN IF NOT EXISTS share_token uuid DEFAULT NULL;

-- 공유 토큰으로 조회하는 인덱스
CREATE INDEX IF NOT EXISTS mystory_sessions_share_token_idx
  ON mystory_sessions (share_token)
  WHERE share_token IS NOT NULL;

-- RLS: share_token으로 completed 세션 공개 열람 허용
CREATE POLICY "mystory_sessions_public_share"
  ON mystory_sessions
  FOR SELECT
  USING (
    share_token IS NOT NULL
    AND status = 'completed'
  );
