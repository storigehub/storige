import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * Supabase Edge Function: send-reminder
 * 매일 오후 8시 (KST) pg_cron 또는 외부 스케줄러로 호출
 * 오늘 기록이 없는 사용자에게 리마인더 푸시 발송
 *
 * 배포: supabase functions deploy send-reminder
 * 스케줄: Dashboard → Database → Cron jobs → "0 11 * * *" (UTC 11시 = KST 20시)
 */

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const FCM_SERVER_KEY = Deno.env.get('FCM_SERVER_KEY') ?? ''

Deno.serve(async (_req) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 오늘 일기 작성한 user_id 목록
  const { data: writtenToday } = await supabase
    .from('entries')
    .select('user_id')
    .gte('created_at', today.toISOString())
    .eq('journal_type', 'diary')

  const writtenSet = new Set((writtenToday ?? []).map((r: { user_id: string }) => r.user_id))

  // push_token이 있는 모든 사용자 (컬럼 존재 시)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, push_token')
    .not('push_token', 'is', null)

  if (!profiles || profiles.length === 0) {
    return new Response(JSON.stringify({ sent: 0 }), { status: 200 })
  }

  let sent = 0
  for (const profile of profiles) {
    if (writtenSet.has(profile.id)) continue // 이미 기록함
    if (!profile.push_token) continue

    // FCM 발송
    const fcmRes = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${FCM_SERVER_KEY}`,
      },
      body: JSON.stringify({
        to: profile.push_token,
        notification: {
          title: '오늘의 기록을 남겨보세요 ✍️',
          body: '잠깐의 기록이 소중한 유산이 됩니다.',
          icon: '/icons/icon-192.png',
        },
        data: { url: '/diary/new' },
      }),
    })

    if (fcmRes.ok) sent++
  }

  return new Response(JSON.stringify({ sent }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
