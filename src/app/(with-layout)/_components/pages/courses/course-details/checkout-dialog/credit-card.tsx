import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Cards from 'react-credit-cards-2'
import { Controller, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Field, FieldError } from '@/components/ui/field'
import { FormField } from '@/components/ui/form-field'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { creditCardCheckoutFormSchema } from '@/server/schemas/payment'

type FormData = z.infer<typeof creditCardCheckoutFormSchema>

type CreditCardFormProps = {
  onBack: () => void
}

export function CreditCardForm({ onBack }: CreditCardFormProps) {
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

  const { handleSubmit, watch } = form
  const formValues = watch()

  function onSubmit(data: FormData) {
    console.log(data)
  }

  //   TODO: Criar lógica para pegar as opções das parcelas
  const installmentsOptions = Array.from({ length: 12 }).map((_, index) => ({
    label: `${index + 1}x`,
    value: String(index + 1),
  }))

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
          <FormField control={form.control} name="addressNumber" placeholder="Número" />
          <FormField control={form.control} name="postalCode" placeholder="CEP" mask="_____-___" />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" type="button" onClick={onBack}>
          <ArrowLeft />
          Voltar
        </Button>

        <Button type="submit">
          Continuar
          <ArrowRight />
        </Button>
      </div>
    </form>
  )
}
