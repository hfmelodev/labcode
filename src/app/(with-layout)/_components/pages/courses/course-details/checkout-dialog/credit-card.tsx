import { zodResolver } from '@hookform/resolvers/zod'
import { InputMask } from '@react-input/mask'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Cards from 'react-credit-cards-2'
import { Controller, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Field, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Nome impresso no cartão"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          <Controller
            name="cpf"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputMask
                  mask="___.___.___-__"
                  replacement={{ _: /\d/ }}
                  component={Input}
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="CPF do títular"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputMask
                  mask="(__)_____-____"
                  replacement={{ _: /\d/ }}
                  component={Input}
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Telefone do títular com DDD"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Separator className="col-span-full my-1 sm:my-2" />

          <Controller
            name="cardNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputMask
                  mask="____ ____ ____ ____"
                  replacement={{ _: /\d/ }}
                  component={Input}
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Número do cartão"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="cardValidThru"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputMask
                  mask="__/__"
                  replacement={{ _: /\d/ }}
                  component={Input}
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Validade"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="cardCvv"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputMask
                  mask="___"
                  replacement={{ _: /\d/ }}
                  component={Input}
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="CVV"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
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
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Endereço (Opcional)" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          <Controller
            name="addressNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Número" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="postalCode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputMask
                  mask="_____-___"
                  replacement={{ _: /\d/ }}
                  component={Input}
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="CEP"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
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
