'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeft, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import Cards from 'react-credit-cards-2'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { createCreditCardCheckout } from '@/app/(with-layout)/_actions/payment-asaas'
import { Button } from '@/components/ui/button'
import { Field, FieldError } from '@/components/ui/field'
import { FormField } from '@/components/ui/form-field'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { calculateInstallmentOptions, formatPrice, unMockValue } from '@/lib/utils'
import { creditCardCheckoutFormSchema } from '@/server/schemas/payment'

type FormData = z.infer<typeof creditCardCheckoutFormSchema>

type CreditCardFormProps = {
  onBack: () => void
  onClose: () => void
  course: Course
}

export function CreditCardForm({ onBack, onClose, course }: CreditCardFormProps) {
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(creditCardCheckoutFormSchema),
    defaultValues: {
      name: '',
      cardNumber: '',
      cardValidThru: '',
      cardCvv: '',
      installments: 1, // parcelas
      cpf: '',
      address: '',
      postalCode: '',
      addressNumber: '',
      phone: '',
    },
  })

  const { handleSubmit, watch, setError } = form
  const formValues = watch()

  const rawCep = watch('postalCode')

  //   Lógica que pega as opções das parcelas
  const installmentsOptions = useMemo(() => {
    return calculateInstallmentOptions(course?.discountPrice ?? course.price).map(option => ({
      label: `${option.installments}x ${formatPrice(option.installmentValue)}${option.hasInterest ? '' : ' (sem juros)'}`,
      value: String(option.installments),
    }))
  }, [course?.discountPrice, course.price])

  const { mutateAsync: handleValidateCep, isPending: isValidatingCep } = useMutation({
    mutationFn: async () => {
      try {
        const cep = unMockValue(rawCep)

        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

        if (response.data.erro) {
          setError('postalCode', { type: 'manual', message: 'CEP inválido' })
          return false
        }

        return true
      } catch {
        setError('postalCode', { type: 'manual', message: 'Erro ao validar CEP, tente novamente.' })
        return false
      }
    },
  })

  const { mutateAsync: handleCreateCheckout, isPending: isLoadingCheckout } = useMutation({
    mutationFn: createCreditCardCheckout,
    onSuccess: async () => {
      toast.success('Pagamento realizado com sucesso!')
      onClose()
      toast.success('Agradecemos por sua compra! Você será redirecionado para o curso em instantes.')

      await new Promise(resolve => setTimeout(resolve, 4000))
      router.push(`/courses/${course.slug}`)
    },
    onError: async error => {
      if (error?.name === 'NOT_AUTHORIZED') {
        toast.error(error.message)
        return
      }

      if (error?.name === 'CONFLICT') {
        toast.error('Você já possui acesso a este curso!')
        onClose()
        return
      }

      toast.error('Ocorreu um erro ao processar o pagamento. Tente novamente ou entre em contato com o suporte.')
    },
  })

  async function onSubmit(data: FormData) {
    const isValidCep = await handleValidateCep()

    if (!isValidCep) return

    toast.promise(
      handleCreateCheckout({
        courseId: course.id,
        ...data,
      }),
      {
        loading: 'Processando pagamento...',
      }
    )
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-4">
        <div>
          <Cards
            number={formValues.cardNumber}
            expiry={formValues.cardValidThru}
            cvc={formValues.cardCvv}
            name={formValues.name}
            placeholders={{ name: 'NOME COMPLETO' }}
            locale={{ valid: 'Válido até' }}
          />
        </div>

        {/* Inputs do Cartão */}
        <div className="grid w-full flex-1 gap-2 sm:grid-cols-2">
          <div className="col-span-full">
            <FormField control={form.control} name="name" placeholder="Nome impresso no cartão" />
          </div>
          <FormField control={form.control} name="cpf" placeholder="CPF do títular" mask="___.___.___-__" />
          <FormField control={form.control} name="phone" placeholder="Telefone do títular com DDD" mask="(__)_____-____" />

          <Separator className="col-span-full my-1 sm:my-2" />

          <FormField control={form.control} name="cardNumber" placeholder="Número do cartão" mask="____ ____ ____ ____" />
          <FormField control={form.control} name="cardValidThru" placeholder="Validade" mask="__/__" />
          <FormField control={form.control} name="cardCvv" placeholder="CVV" mask="___" />

          <Controller
            name="installments"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive" data-invalid={fieldState.invalid}>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                <Select
                  value={String(field.value)}
                  onChange={value => field.onChange(Number(value))}
                  options={installmentsOptions}
                  placeholder="Parcelas"
                />
              </Field>
            )}
          />

          <Separator className="col-span-full my-1 sm:my-2" />

          <div className="col-span-full">
            <FormField control={form.control} name="address" placeholder="Endereço (Opcional)" />
          </div>
          <FormField name="addressNumber" control={form.control} placeholder="Número" onlyNumbers />
          <FormField control={form.control} name="postalCode" placeholder="CEP" mask="_____-___" />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" type="button" onClick={onBack}>
          <ArrowLeft />
          Voltar
        </Button>

        <Button type="submit" disabled={isLoadingCheckout || isValidatingCep}>
          Confirmar
          <Check />
        </Button>
      </div>
    </form>
  )
}
