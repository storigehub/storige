-- AI 자서전(MyStory) 인터뷰 세션
-- 적용: supabase db push 또는 Dashboard SQL

CREATE TABLE IF NOT EXISTS mystory_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  topic_category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  messages JSONB NOT NULL DEFAULT '[]',
  generated_text TEXT,
  word_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mystory_sessions_user_id_idx
  ON mystory_sessions(user_id);
CREATE INDEX IF NOT EXISTS mystory_sessions_user_topic_idx
  ON mystory_sessions(user_id, topic_id);

ALTER TABLE mystory_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mystory_owner" ON mystory_sessions;
CREATE POLICY "mystory_owner"
  ON mystory_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
