/**
 * AI 자서전 질문 풀 — 나의이야기(MyStory) 이관
 * 14개 카테고리 × 평균 6개 질문
 */

export interface TopicQuestion {
  id: string
  category: string
  categoryEmoji: string
  title: string
  questions: string[]
}

export const TOPIC_QUESTIONS: TopicQuestion[] = [
  {
    id: 'birth-story',
    category: '탄생과 뿌리',
    categoryEmoji: '🌱',
    title: '나의 탄생 이야기',
    questions: [
      '어디에서 태어나셨나요? 그 고장의 특별한 점은 무엇인가요?',
      '태어났을 때 어떤 에피소드가 있었나요?',
      '부모님이 들려주신 탄생 이야기가 있나요?',
      '이름에 담긴 뜻이나 이름을 지어주신 분의 이야기가 있나요?',
      '가족의 뿌리, 조상에 대해 아는 이야기가 있나요?',
    ],
  },
  {
    id: 'childhood-home',
    category: '유년시절',
    categoryEmoji: '🏡',
    title: '어린 시절의 집',
    questions: [
      '어린 시절을 보낸 집이나 동네를 떠올리면 가장 먼저 생각나는 것은 무엇인가요?',
      '어릴 때 자주 놀던 장소가 있었나요?',
      '어린 시절 기억에 남는 냄새, 소리, 풍경이 있나요?',
      '동네 친구들과의 추억이 있다면 이야기해 주세요.',
      '어릴 때 좋아했던 음식이나 계절이 있었나요?',
    ],
  },
  {
    id: 'family-memories',
    category: '가족',
    categoryEmoji: '👨‍👩‍👧‍👦',
    title: '가족과의 추억',
    questions: [
      '부모님의 모습 중 가장 기억에 남는 장면이 있나요?',
      '형제자매와의 특별한 추억이 있나요?',
      '가족이 함께했던 행사나 여행 중 기억에 남는 것은 무엇인가요?',
      '부모님께서 자주 하셨던 말씀이나 가르침이 있나요?',
      '가족 중 가장 큰 영향을 받은 분은 누구인가요?',
    ],
  },
  {
    id: 'school-days',
    category: '학창시절',
    categoryEmoji: '🎒',
    title: '학교 시절',
    questions: [
      '학창시절 중 가장 기억에 남는 선생님이 계신가요?',
      '학교에서 잘했던 과목이나 활동이 있었나요?',
      '친했던 친구들과의 추억을 들려주세요.',
      '학창시절의 꿈은 무엇이었나요?',
      '졸업식이나 입학식 때의 기억이 남아 있나요?',
    ],
  },
  {
    id: 'first-love',
    category: '청춘',
    categoryEmoji: '💌',
    title: '청춘과 첫사랑',
    questions: [
      '청춘 시절 가장 설레었던 순간이 있었나요?',
      '첫사랑에 대한 이야기를 들려주실 수 있나요?',
      '20대의 나는 어떤 사람이었나요?',
      '청춘 시절 가장 열정적으로 했던 일은 무엇인가요?',
      '그 시절로 돌아간다면 무엇을 다르게 하고 싶으신가요?',
    ],
  },
  {
    id: 'career-path',
    category: '직업과 일',
    categoryEmoji: '💼',
    title: '나의 직업 이야기',
    questions: [
      '처음 사회에 나왔을 때의 이야기를 들려주세요.',
      '어떤 일을 하셨나요? 그 일을 선택한 이유가 있나요?',
      '직장이나 사업에서 가장 자랑스러운 순간이 있었나요?',
      '일 때문에 힘들었던 시기가 있었나요? 어떻게 이겨내셨나요?',
      '일을 통해 배운 가장 중요한 교훈은 무엇인가요?',
    ],
  },
  {
    id: 'marriage-family',
    category: '결혼과 가정',
    categoryEmoji: '💍',
    title: '결혼과 가정 이야기',
    questions: [
      '배우자를 어떻게 만나셨나요?',
      '결혼 준비 과정이나 결혼식 날의 이야기를 들려주세요.',
      '결혼 후 가장 행복했던 순간은 언제인가요?',
      '자녀가 태어났을 때의 감동이 있다면 이야기해 주세요.',
      '가정을 꾸리면서 가장 중요하게 생각했던 것은 무엇인가요?',
    ],
  },
  {
    id: 'hardships',
    category: '시련과 극복',
    categoryEmoji: '💪',
    title: '시련을 이겨낸 이야기',
    questions: [
      '살면서 가장 힘들었던 시기는 언제였나요?',
      '그 어려움을 어떻게 극복하셨나요?',
      '힘들 때 가장 의지가 됐던 것은 무엇인가요?',
      '그 경험이 당신을 어떻게 바꾸었나요?',
      '지금 어려움을 겪는 사람에게 해주고 싶은 말이 있나요?',
    ],
  },
  {
    id: 'hobbies-interests',
    category: '취미와 관심사',
    categoryEmoji: '🎨',
    title: '좋아하는 것들',
    questions: [
      '살면서 가장 즐겼던 취미나 활동은 무엇인가요?',
      '특별히 아끼는 물건이 있나요? 그 이유는?',
      '즐겨 보셨던 영화, 책, 음악이 있나요?',
      '여행 중 가장 기억에 남는 곳은 어디인가요?',
      '지금도 계속하고 싶은 일이 있나요?',
    ],
  },
  {
    id: 'faith-values',
    category: '신념과 가치관',
    categoryEmoji: '🌟',
    title: '나의 신념과 철학',
    questions: [
      '삶에서 가장 중요하게 생각하는 가치는 무엇인가요?',
      '신앙이나 삶의 철학이 있다면 이야기해 주세요.',
      '어려운 선택의 순간, 어떤 기준으로 결정하셨나요?',
      '후회하는 일이 있다면 무엇인가요?',
      '다시 태어난다면 어떤 삶을 살고 싶으신가요?',
    ],
  },
  {
    id: 'social-history',
    category: '시대와 역사',
    categoryEmoji: '📰',
    title: '내가 살아온 시대',
    questions: [
      '어린 시절 기억하는 나라의 모습은 어떠했나요?',
      '역사적인 사건 중 직접 경험하거나 기억하는 것이 있나요?',
      '시대의 변화 중 가장 놀라웠던 것은 무엇인가요?',
      '젊었을 때와 지금의 세상이 어떻게 달라졌다고 느끼시나요?',
      '다음 세대에게 전해주고 싶은 시대의 이야기가 있나요?',
    ],
  },
  {
    id: 'proud-moments',
    category: '자랑스러운 순간',
    categoryEmoji: '🏆',
    title: '내 인생 최고의 순간',
    questions: [
      '삶에서 가장 자랑스러웠던 순간은 언제인가요?',
      '누군가에게 꼭 인정받고 싶었던 일이 있나요?',
      '주변 사람들을 도왔던 기억 중 뿌듯했던 것이 있나요?',
      '작은 것이지만 스스로 대견했던 일이 있나요?',
    ],
  },
  {
    id: 'letters-to-future',
    category: '미래와 유언',
    categoryEmoji: '✉️',
    title: '사랑하는 이들에게',
    questions: [
      '자녀나 손자녀에게 꼭 전하고 싶은 말이 있나요?',
      '앞으로 남은 삶에서 하고 싶은 것이 있나요?',
      '내가 세상을 떠난 후 어떻게 기억되고 싶으신가요?',
      '사랑하는 사람들에게 감사하다고 말하고 싶은 것이 있나요?',
      '내 인생을 한 문장으로 표현한다면 어떻게 하시겠어요?',
    ],
  },
]

export function getTopicById(id: string): TopicQuestion | undefined {
  return TOPIC_QUESTIONS.find(t => t.id === id)
}

export const CATEGORY_GROUPS = [
  { label: '뿌리와 성장', ids: ['birth-story', 'childhood-home', 'family-memories'] },
  { label: '청춘과 사회', ids: ['school-days', 'first-love', 'career-path'] },
  { label: '가정과 삶', ids: ['marriage-family', 'hardships', 'hobbies-interests'] },
  { label: '정신과 유산', ids: ['faith-values', 'social-history', 'proud-moments', 'letters-to-future'] },
]
