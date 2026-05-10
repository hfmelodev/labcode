import { Bookmark } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface CourseItemProps {
  course: CourseWithTagsAndModules
  redirectTo?: 'lessons' | 'details'
}

export function CourseItem({ course, redirectTo = 'details' }: CourseItemProps) {
  return (
    <Link
      href={redirectTo === 'details' ? `/courses/details/${course.slug}` : `/courses/${course.slug}`}
      className="overflow-hidden border bg-card transition-all hover:border-primary"
    >
      <Image
        src={course.thumbnail}
        alt={`Thumbnail do curso ${course.title}`}
        width={400}
        height={200}
        className="h-40 w-full object-cover"
      />

      <div className="flex flex-col gap-2 px-3 py-3.5">
        <h3 className="font-bold text-sm">{course.title}</h3>

        <div className="mask-r-from-80% flex gap-2 overflow-hidden">
          <Badge variant="outline" className="max-w-max gap-1 border-primary bg-primary/10 text-primary">
            <Bookmark size={14} />
            {course.modules.length} Módulos
          </Badge>

          {!!course.tags &&
            course.tags.map(tag => (
              <Badge key={`${course.id}-${tag.id}`} variant="outline" className="max-w-max">
                {tag.name}
              </Badge>
            ))}
        </div>
      </div>
    </Link>
  )
}
