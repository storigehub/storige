-- Dear My Son 편지 발송 예약 날짜 필드 추가
-- 적용: supabase db push 또는 Dashboard SQL

ALTER TABLE entries
  ADD COLUMN IF NOT EXISTS scheduled_send_at TIMESTAMPTZ NULL;

COMMENT ON COLUMN entries.scheduled_send_at IS 'Dear 편지의 예약 발송 날짜 (NULL = 유고 시 자동 전달)';
