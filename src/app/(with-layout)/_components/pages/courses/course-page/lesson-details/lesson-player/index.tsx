'use client'

import dynamic from 'next/dynamic'
import { usePreferencesStore } from '@/stores/preferences'

const VideoPlayer = dynamic(() => import('./video-player'), { ssr: false })

type LessonPlayerProps = {
  lesson: CourseLesson
}

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const autoplay = usePreferencesStore(state => state.autoplay)

  const videoId = lesson.videoId

  return (
    <div key={videoId} className="aspect-video w-full overflow-hidden dark:bg-black">
      <VideoPlayer videoId={videoId} autoPlay={autoplay} />
    </div>
  )
}
