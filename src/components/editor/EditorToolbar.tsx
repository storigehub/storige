'use client'

import type { Editor } from '@tiptap/react'

interface EditorToolbarProps {
  editor: Editor | null
}

// 에디터 서식 툴바 — Day One 스타일 (최소화)
export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null

  const tools = [
    {
      label: 'B',
      title: '굵게',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      className: 'font-bold',
    },
    {
      label: 'I',
      title: '기울임',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      className: 'italic',
    },
    {
      label: '≡',
      title: '목록',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      className: '',
    },
    {
      label: '1.',
      title: '번호 목록',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      className: '',
    },
    {
      label: '"',
      title: '인용',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      className: 'text-lg',
    },
  ]

  return (
    <div className="flex items-center gap-1 px-2 py-1 border-b border-[#f0f0f0] bg-white">
      {tools.map((tool) => (
        <button
          key={tool.label}
          onClick={tool.action}
          title={tool.title}
          className={`w-8 h-8 rounded flex items-center justify-center text-sm transition-colors
            ${tool.isActive
              ? 'bg-primary text-white'
              : 'text-[#888] hover:bg-[#f5f5f5]'
            } ${tool.className}`}
        >
          {tool.label}
        </button>
      ))}
    </div>
  )
}
