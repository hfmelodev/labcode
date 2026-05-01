'use client'

import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(() => import('./video-player'), { ssr: false })

type LessonPlayerProps = {
  lesson: CourseLesson
}

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  return (
    <div className="aspect-video w-full overflow-hidden dark:bg-black">
      <VideoPlayer videoId={lesson.videoId} autoPlay={false} />
    </div>
  )
}
