'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CourseDifficulty } from 'generated/prisma/enums'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { createCourseTag, getCourseTags } from '@/app/(with-layout)/_actions/courses'
import { BackButton } from '@/components/app/back-button'
import { Dropzone } from '@/components/ui/dropzone'
import { Editor } from '@/components/ui/editor'
import { FieldLabel } from '@/components/ui/field'
import { FormField } from '@/components/ui/form-field'
import MultipleSelector, { type Option } from '@/components/ui/multiple-selector'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { queryKeys } from '@/constants/query-keys'
import { formatDifficulty } from '@/lib/utils'
import type { CreateCourseFormData } from '@/server/schemas/course'
import { createCourseSchema } from '@/server/schemas/course'

export function CourseForm() {
  const form = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: '',
      description: '',
      shortDescription: '',
      thumbnail: undefined,
      price: 0,
      discountPrice: '' as unknown as number,
      difficulty: 'EASY',
      tagsIds: [],
      modules: [],
    },
  })

  const { handleSubmit, control, setValue, watch } = form

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
    console.log(data)
  }

  return (
    <>
      <BackButton />

      <div>
        <h1 className="font-bold text-2xl">Criar curso</h1>
        <p className="mt-2 text-muted-foreground">Preencha as informações abaixo para criar um novo curso.</p>
      </div>

      <Separator className="my-2" />

      <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <FormField control={control} name="title" label="Título" placeholder="Curso de React" />
        <FormField
          control={control}
          name="shortDescription"
          label="Descrição curta (opcional)"
          placeholder="Aprenda a criar uma aplicação de gerenciamento de tarefas."
        />
        <FormField control={control} name="price" label="Preço" placeholder="100" />
        <FormField control={control} name="discountPrice" label="Preço promocional (opcional)" placeholder="89.99" />

        <Controller
          name="tagsIds"
          control={control}
          render={({ field }) => (
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
          render={({ field }) => (
            <div className="col-span-full space-y-3">
              <FieldLabel htmlFor={field.name}>Thumbnail</FieldLabel>
              <Dropzone setFile={field.onChange} file={field.value} />
            </div>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="col-span-full space-y-3">
              <FieldLabel htmlFor={field.name}>Descrição</FieldLabel>
              <Editor value={field.value} onChange={field.onChange} />
            </div>
          )}
        />
      </form>
    </>
  )
}
