'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { dequal } from 'dequal'
import { CourseDifficulty } from 'generated/prisma/enums'
import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  createCourse,
  createCourseModules,
  createCourseTag,
  deleteCourseLessons,
  deleteCourseModules,
  getCourseTags,
  revalidateCourseDetails,
  updateCourse,
  updateCourseModules,
} from '@/app/(with-layout)/_actions/courses'
import { BackButton } from '@/components/app/back-button'
import { Button } from '@/components/ui/button'
import { Dropzone } from '@/components/ui/dropzone'
import { Editor } from '@/components/ui/editor'
import { FieldError, FieldLabel } from '@/components/ui/field'
import { FormField } from '@/components/ui/form-field'
import MultipleSelector, { type Option } from '@/components/ui/multiple-selector'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { queryKeys } from '@/constants/query-keys'
import { formatDifficulty, urlToFile } from '@/lib/utils'
import type { CreateCourseFormData } from '@/server/schemas/course'
import { createCourseSchema } from '@/server/schemas/course'
import { ModulesList } from './modules-list'

type CourseFormInitialData = Omit<CreateCourseFormData, 'thumbnail'> & {
  thumbnailUrl: string
}

type CourseFormData = {
  initialData?: CourseFormInitialData
}

export function CourseForm({ initialData }: CourseFormData) {
  const router = useRouter()
  const params = useParams<{ courseId: string }>()

  const { courseId } = params

  const isEditing = !!initialData

  const [initialDataIsSet, setInitialDataIsSet] = useState(false)

  const form = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: '',
      description: '',
      shortDescription: '',
      thumbnail: undefined,
      price: '' as unknown as number,
      discountPrice: '' as unknown as number,
      difficulty: 'EASY',
      tagsIds: [],
      modules: [],
    },
  })

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { dirtyFields },
  } = form

  const setInitialData = useCallback(
    async (data: CourseFormInitialData) => {
      const thumbnailFile = await urlToFile(data.thumbnailUrl)

      reset({
        ...data,
        thumbnail: thumbnailFile,
      })

      setInitialDataIsSet(true)
    },
    [reset]
  )

  useEffect(() => {
    if (initialData) setInitialData(initialData)
  }, [initialData, setInitialData])

  const tagsIds = watch('tagsIds')

  const { data: tagsData } = useQuery({
    queryKey: queryKeys.courseTags(),
    queryFn: getCourseTags,
  })

  const queryClient = useQueryClient()

  const { mutate: handleCreatetag, isPending: isCreatingTag } = useMutation({
    mutationFn: createCourseTag,
    onSuccess: newTag => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTags() })

      setValue('tagsIds', [...tagsIds, newTag.id], { shouldValidate: true })
    },
  })

  const { mutate: handleUpdateCourse, isPending: isUpdatingCourse } = useMutation({
    mutationFn: async (data: CreateCourseFormData) => {
      if (!initialData) return

      await updateCourse({
        id: courseId,
        ...data,
        // dirtyFields significa campos sujos ou seja, campos que foram alterados pelo usuário
        thumbnail: dirtyFields.thumbnail ? data.thumbnail : undefined,
      })

      // Verifica se os dados foram alterados
      const isModulesUpdated = !dequal(initialData.modules, data.modules)

      if (!isModulesUpdated) {
        await revalidateCourseDetails(courseId)
        return
      }

      // Verifica quais módulos foram removidos
      const removedModules = initialData.modules.filter(mod => !data.modules.find(m => m.id === mod.id))

      // Busca novas aulas
      const allLessons = data.modules.flatMap(mod => mod.lessons)
      // Busca todas as aulas do curso antigas
      const allInitialLessons = initialData.modules.flatMap(mod => mod.lessons)

      // Busca aulas removidas
      const removedLessons = allInitialLessons.filter(lesson => !allLessons.find(l => l.id === lesson.id))

      // Busca módulos novos
      const modulesToCreate = data.modules.filter(mod => !initialData.modules.find(m => m.id === mod.id))

      // Busca módulos que não foram removidos e não foram criados
      const modulesToUpdate = data.modules.filter(
        mod => !removedModules.find(m => m.id === mod.id) && !modulesToCreate.find(m => m.id === mod.id)
      )

      if (!!removedLessons.length) {
        await deleteCourseLessons(removedLessons.map(lesson => lesson.id))
      }

      if (!!removedModules.length) {
        await deleteCourseModules(removedModules.map(mod => mod.id))
      }

      if (!!modulesToCreate.length) {
        await createCourseModules(courseId, modulesToCreate)
      }

      if (!!modulesToUpdate.length) {
        await updateCourseModules(modulesToUpdate)
      }

      await revalidateCourseDetails(courseId)
    },
    onSuccess: () => {
      toast.success('Curso atualizado com sucesso!')
      router.push('/admin/courses')
    },
    onError: error => {
      console.error(error)
      toast.error('Ocorreu um erro ao atualizar o curso. Tente novamente mais tarde.')
    },
  })

  const { mutate: handleCreateCourse, isPending: isCreatingCourse } = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast.success('Curso criado com sucesso!')
      router.push('/admin/courses')
    },
    onError: error => {
      console.error(error)
      toast.error('Ocorreu um erro ao criar o curso. Tente novamente mais tarde.')
    },
  })

  const tagsOptions = useMemo(() => (tagsData ?? []).map(tag => ({ label: tag.name, value: tag.id })), [tagsData])

  const difficultyOptions = [
    {
      label: formatDifficulty(CourseDifficulty.EASY),
      value: CourseDifficulty.EASY,
    },
    {
      label: formatDifficulty(CourseDifficulty.MEDIUM),
      value: CourseDifficulty.MEDIUM,
    },
    {
      label: formatDifficulty(CourseDifficulty.HARD),
      value: CourseDifficulty.HARD,
    },
  ]

  const selectedTags = useMemo(() => {
    return tagsOptions.filter(tag => tagsIds.includes(tag.value))
  }, [tagsOptions, tagsIds])

  function handleChangeTags(value: Option[]) {
    // Verifica se tem alguma tag nova para criar
    const tagToCreate = value.find(tag => !tagsOptions.find(option => option.value === tag.value))

    if (tagToCreate) {
      handleCreatetag(tagToCreate.value)
    }

    setValue(
      'tagsIds',
      value.map(tag => tag.value),
      { shouldValidate: true }
    )
  }

  async function onSubmit(data: CreateCourseFormData) {
    const dataWithOrder: CreateCourseFormData = {
      ...data,
      modules: data.modules.map((mod, index) => ({
        ...mod,
        order: index + 1,
        lessons: mod.lessons.map((lesson, index) => ({
          ...lesson,
          order: index + 1,
        })),
      })),
    }

    if (isEditing) {
      handleUpdateCourse(dataWithOrder)
      return
    }

    handleCreateCourse(dataWithOrder)
  }

  return (
    <>
      <BackButton />

      <div>
        <h1 className="font-bold text-2xl">{isEditing ? 'Editar curso' : 'Criar curso'}</h1>
        <p className="mt-2 text-muted-foreground">
          {isEditing
            ? 'Preencha as informações abaixo para editar o curso.'
            : 'Preencha as informações abaixo para criar um novo curso.'}
        </p>
      </div>

      <Separator className="my-2" />

      <FormProvider {...form}>
        <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <FormField control={control} name="title" label="Título" placeholder="Curso de React" />
          <FormField
            control={control}
            name="shortDescription"
            label="Descrição curta (opcional)"
            placeholder="Aprenda a criar uma aplicação de gerenciamento de tarefas."
          />
          <FormField control={control} name="price" label="Preço" placeholder="100" onlyNumbers valueAsNumber />
          <FormField
            control={control}
            name="discountPrice"
            label="Preço promocional (opcional)"
            placeholder="89.99"
            onlyNumbers
            valueAsNumber
          />

          <Controller
            name="tagsIds"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-3">
                <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
                <MultipleSelector
                  options={tagsOptions}
                  creatable
                  value={selectedTags}
                  onChange={value => handleChangeTags(value)}
                  placeholder="Selecione as tags"
                  className="placeholder:text-sm"
                  disabled={isCreatingTag}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </div>
            )}
          />

          <Controller
            name="difficulty"
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                <FieldLabel htmlFor={field.name}>Dificuldade</FieldLabel>
                <Select options={difficultyOptions} value={field.value} onChange={field.onChange} />
              </div>
            )}
          />

          <Controller
            name="thumbnail"
            control={control}
            render={({ field, fieldState }) => (
              <div className="col-span-full space-y-3">
                <FieldLabel htmlFor={field.name}>Thumbnail</FieldLabel>
                <Dropzone setFile={field.onChange} file={field.value} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </div>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <div className="col-span-full space-y-3">
                <FieldLabel htmlFor={field.name}>Descrição</FieldLabel>
                <Editor key={`editor-field-${initialDataIsSet}`} value={field.value} onChange={field.onChange} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </div>
            )}
          />

          <Separator className="col-span-full my-2" />

          <ModulesList />

          <div className="col-span-full flex justify-end">
            <Button type="submit" disabled={isCreatingCourse || isUpdatingCourse}>
              {isCreatingCourse || isUpdatingCourse ? (
                <>
                  <Loader2 className="animate-spin" />
                  {isUpdatingCourse ? 'Atualizando...' : 'Criando...'}
                </>
              ) : (
                <>{isEditing ? 'Atualizar curso' : 'Criar curso'}</>
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}
