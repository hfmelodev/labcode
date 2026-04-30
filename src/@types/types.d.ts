type Course = import('../../generated/prisma/client').Course
type CourseTag = import('../../generated/prisma/client').CourseTag
type CourseModule = import('../../generated/prisma/client').CourseModule

type CourseWithTagsAndModules = Course & {
  tags: CourseTag[]
  modules: CourseModule[]
}
