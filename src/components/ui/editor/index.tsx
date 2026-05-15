'use client'

import { EditorContent, type Extension, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { BlockquoteToolbar } from '@/components/toolbars/blockquote'
import { BoldToolbar } from '@/components/toolbars/bold'
import { BulletListToolbar } from '@/components/toolbars/bullet-list'
import { CodeToolbar } from '@/components/toolbars/code'
import { ItalicToolbar } from '@/components/toolbars/italic'
import { OrderedListToolbar } from '@/components/toolbars/ordered-list'
import { StrikeThroughToolbar } from '@/components/toolbars/strikethrough'
import { ToolbarProvider } from '@/components/toolbars/toolbar-provider'

const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal',
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc',
      },
    },
    code: {
      HTMLAttributes: {
        class: 'bg-accent rounded-md p-1',
      },
    },
    heading: {
      levels: [1, 2, 3, 4],
      HTMLAttributes: {
        class: 'tiptap-heading',
      },
    },
  }),
]

type EditorProps = {
  value: string
  onChange: (value: string) => void
}

export function Editor({ value, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: extensions as Extension[],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }
  return (
    <div className="relative w-full overflow-hidden border pb-3">
      <div className="sticky top-0 left-0 z-20 flex w-full items-center justify-between border-b bg-background px-2 py-2">
        <ToolbarProvider editor={editor}>
          <div className="flex items-center gap-2">
            <BoldToolbar />
            <ItalicToolbar />
            <StrikeThroughToolbar />
            <BulletListToolbar />
            <OrderedListToolbar />
            <CodeToolbar />
            <BlockquoteToolbar />
          </div>
        </ToolbarProvider>
      </div>
      <div
        onClick={() => {
          editor?.chain().focus().run()
        }}
        className="min-h-72 cursor-text bg-background"
      >
        <EditorContent className="outline-none" editor={editor} />
      </div>
    </div>
  )
}
