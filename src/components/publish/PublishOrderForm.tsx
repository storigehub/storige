'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface PublishOrderFormProps {
  selectedEntryIds: string[]
  publishType: 'diary' | 'dear' | 'album' | 'mystory'
  pageCount: number
  onBack: () => void
}

const PRICE_TABLE: Record<string, number> = {
  diary: 39000,
  dear: 39000,
  album: 29000,
  mystory: 49000,
}

const TYPE_LABEL: Record<string, string> = {
  diary: '일기 단행본',
  dear: '편지 모음집',
  album: '포토앨범',
  mystory: 'AI 자서전',
}

// 출판 주문 폼 — 배송지 + 결제 (포트원 연동 예정)
export function PublishOrderForm({ selectedEntryIds, publishType, pageCount, onBack }: PublishOrderFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const price = PRICE_TABLE[publishType] ?? 39000
  const shippingFee = 3000
  const total = price + shippingFee

  const handleOrder = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('배송 정보를 모두 입력하세요')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 주문 레코드 생성
      const { data: order, error } = await supabase.from('publish_orders').insert({
        user_id: user.id,
        publish_type: publishType,
        status: 'pending',
        page_count: pageCount,
        preview_data: { entry_ids: selectedEntryIds },
        amount: total,
        shipping_address: { name, phone, address, addressDetail },
      }).select('id').single()

      if (error) throw error

      // TODO: 포트원 결제 연동 (Phase 3-7에서 구현)
      // 현재는 주문 생성 후 성공 페이지로 이동
      alert(`주문이 접수되었습니다!\n주문 ID: ${order?.id}\n\n결제 연동은 Phase 3-7에서 완성됩니다.`)
      router.push('/publish')
    } catch {
      setError('주문 중 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* 주문 요약 */}
      <div className="bg-diary-open rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-[#1A1A1A] mb-2">{TYPE_LABEL[publishType]}</h3>
        <div className="space-y-1 text-xs text-[#555]">
          <div className="flex justify-between">
            <span>선택된 글 수</span>
            <span>{selectedEntryIds.length}편</span>
          </div>
          <div className="flex justify-between">
            <span>예상 페이지</span>
            <span>{pageCount}p</span>
          </div>
          <div className="flex justify-between">
            <span>도서 가격</span>
            <span>{price.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span>배송비</span>
            <span>{shippingFee.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between font-bold text-primary text-sm pt-1 border-t border-[#d0e8ff]">
            <span>총 금액</span>
            <span>{total.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 배송 정보 */}
      <div>
        <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">배송 정보</h3>
        <div className="space-y-2">
          {[
            { label: '받는 분', value: name, setter: setName, placeholder: '이름', type: 'text' },
            { label: '연락처', value: phone, setter: setPhone, placeholder: '010-0000-0000', type: 'tel' },
            { label: '주소', value: address, setter: setAddress, placeholder: '기본 주소', type: 'text' },
            { label: '상세 주소', value: addressDetail, setter: setAddressDetail, placeholder: '상세 주소 (선택)', type: 'text' },
          ].map(({ label, value, setter, placeholder, type }) => (
            <div key={label}>
              <p className="text-xs text-[#888] mb-1">{label}</p>
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-xl text-sm outline-none focus:border-primary"
              />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-[#FF4757]">{error}</p>}

      {/* 버튼 */}
      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-[#e0e0e0] rounded-xl text-sm text-[#555]"
        >
          이전
        </button>
        <button
          onClick={handleOrder}
          disabled={isSubmitting}
          className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-40"
        >
          {isSubmitting ? '처리 중...' : `${total.toLocaleString()}원 주문하기`}
        </button>
      </div>

      <p className="text-[10px] text-center text-[#B0B0B0]">
        결제는 포트원(PortOne)을 통해 안전하게 처리됩니다
      </p>
    </div>
  )
}
