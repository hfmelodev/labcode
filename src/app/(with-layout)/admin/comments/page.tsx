import { getAdminComments } from '../../_actions/course-comments'
import { AdminCommentItem } from '../../_components/pages/admin/admin-comment-item'

export default async function AdminCommentsPage() {
  const comments = await getAdminComments()

  return (
    <>
      <h1 className="font-bold text-2xl">Comentários</h1>

      <div className="flex w-full flex-col gap-3">
        {comments.map(comment => (
          <AdminCommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </>
  )
}
