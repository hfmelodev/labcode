import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { createCheckoutPix } from '@/app/(with-layout)/_actions/payment-asaas'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { pixCheckoutFormSchema } from '@/server/schemas/payment'

type FormData = z.infer<typeof pixCheckoutFormSchema>

type PixFormProps = {
  onBack: () => void
  course: Course
}

export function PixForm({ onBack, course }: PixFormProps) {
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

  const { handleSubmit } = form

  const { mutateAsync: handleCreateInvoice, isPending: isCreatingInvoice } = useMutation({
    mutationFn: createCheckoutPix,
    onSuccess: () => {
      setStep(2)
    },
  })

  function onSubmit(data: FormData) {
    // TODO: Validar o CEP

    toast.promise(
      handleCreateInvoice({
        courseId: course.id,
        cpf: data.cpf,
        postalCode: data.postalCode,
        addressNumber: data.addressNumber,
        name: data.name,
      }),
      {
        loading: 'Gerando QRCode de Pix...',
      }
    )
  }

  function handleBack() {
    if (step === 1) {
      onBack()
      return
    }

    setStep(1)
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        {/* Conteúdo do passo 1 */}
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
          <>
            {/* Conteúdo do passo 2 */}
            <div className="w-full">
              <p className="mt-2 mb-3 text-center">QR CODE DO PIX</p>
            </div>
          </>
        )}

        <div className="mt-6 flex w-full flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
          <Button variant="outline" className="w-full md:w-max" onClick={handleBack} type="button">
            <ArrowLeft />
            Voltar
          </Button>

          {step === 1 ? (
            <Button type="submit" className="w-full md:w-max" disabled={isCreatingInvoice}>
              Continuar
              <ArrowRight />
            </Button>
          ) : (
            <Button type="button">
              Confirmar pagamento
              <Check />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
