import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { pixCheckoutFormSchema } from '@/server/schemas/payment'

type FormData = z.infer<typeof pixCheckoutFormSchema>

type PixFormProps = {
  onBack: () => void
}

export function PixForm({ onBack }: PixFormProps) {
  const [step, setStep] = useState(1)

  const form = useForm<FormData>({
    resolver: zodResolver(pixCheckoutFormSchema),
    defaultValues: {
      name: '',
      cpf: '',
      postalCode: '',
      addressNumber: '',
    },
  })

  function onSubmit(data: FormData) {
    console.log(data)
  }

  function handleBack() {
    if (step === 1) {
      onBack()
      return
    }

    setStep(1)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {step === 1 ? (
          <div className="w-full">
            <h2 className="mt-2 mb-3 text-center">
              Para gerar o QRCode, por favor informe os dados abaixo
              <span className="block text-sm opacity-50">(Serão utilizados apenas para emissão de nota fiscal)</span>
            </h2>

            <div className="grid w-full gap-2 sm:grid-cols-2">
              <FormField name="name" control={form.control} placeholder="Nome" />
              <FormField name="cpf" control={form.control} placeholder="CPF" mask="___.___.___-__" />
              <FormField name="postalCode" control={form.control} placeholder="CEP" mask="_____-___" />
              <FormField name="addressNumber" control={form.control} placeholder="Número" onlyNumbers />
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <div className="mt-6 flex w-full flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
          <Button variant="outline" type="button" className="w-full md:w-max" onClick={handleBack}>
            <ArrowLeft />
            Voltar
          </Button>

          {step === 1 ? (
            <Button type="submit" className="w-full md:w-max">
              Continuar
              <ArrowRight />
            </Button>
          ) : (
            <Button type="button" className="w-full md:w-max">
              Confirmar pagamento
              <Check />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
