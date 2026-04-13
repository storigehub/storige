-- MyStory 사용자 바이오 프로필 테이블
-- 토픽 완료 시 AI가 추출한 핵심 사실을 누적 저장
-- 이후 인터뷰 시 크로스 토픽 개인화에 활용

CREATE TABLE IF NOT EXISTS mystory_profile (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- 추출된 전기적 사실 (자유 구조 JSONB)
  -- 예: { "birthplace": "부산 영도", "family": ["아버지 어부"], "career": ["공무원 30년"] }
  facts       jsonb NOT NULL DEFAULT '{}',
  -- 팩트 추출이 완료된 토픽 ID 목록 (중복 추출 방지)
  completed_topics text[] NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 사용자당 프로필 1개
CREATE UNIQUE INDEX IF NOT EXISTS mystory_profile_user_id_key ON mystory_profile(user_id);

-- RLS 활성화
ALTER TABLE mystory_profile ENABLE ROW LEVEL SECURITY;

-- 본인만 읽기/쓰기
CREATE POLICY "owner_select" ON mystory_profile
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "owner_insert" ON mystory_profile
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "owner_update" ON mystory_profile
  FOR UPDATE USING (auth.uid() = user_id);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_mystory_profile_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER mystory_profile_updated_at
  BEFORE UPDATE ON mystory_profile
  FOR EACH ROW EXECUTE FUNCTION update_mystory_profile_updated_at();
