import { CommentInput } from './comment-input'

export function LessonComments() {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-semibold text-lg">Comentários</h3>
      <CommentInput />
    </div>
  )
}
