/**
 * useEffect 안에서 비동기 load가 첫 줄에서 setState를 호출할 때
 * react-hooks/set-state-in-effect 규칙을 피하기 위해 콜백을 다음 마이크로태스크로 미룸.
 */
export function scheduleEffectCallback(fn: () => void | Promise<void>): void {
  queueMicrotask(() => {
    void fn()
  })
}
