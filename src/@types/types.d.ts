type Course = import('../../generated/prisma/client').Course
type CourseTag = import('../../generated/prisma/client').CourseTag
type CourseModule = import('../../generated/prisma/client').CourseModule
type CourseLesson = import('../../generated/prisma/client').CourseLesson

type CourseWithTagsAndModules = Course & {
  tags: CourseTag[]
  modules: CourseModule[]
}

type CourseModuleWithLessons = CourseModule & {
  lessons: CourseLesson[]
}
