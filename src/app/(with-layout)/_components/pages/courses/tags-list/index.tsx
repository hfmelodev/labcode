import { prisma } from '@/lib/prisma'
import { DraggableScroll } from '../../../shared/draggable-scroll'
import { TagItem } from './tag-item'

export async function CourseTagsList() {
  const tags = await prisma.courseTag.findMany()

  const sortedTags = tags.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <DraggableScroll className="scroll-hidden mask-r-from-80% flex w-full select-none gap-2 overflow-auto pr-28 outline-none">
      {sortedTags.map(tag => (
        <TagItem key={tag.id} tag={tag} />
      ))}
    </DraggableScroll>
  )
}
