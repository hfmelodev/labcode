'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeft, ArrowRight, Check, Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { createCheckoutPix, getInvoiceStatus, getPixQrCode } from '@/app/(with-layout)/_actions/payment-asaas'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { unMockValue } from '@/lib/utils'
import { pixCheckoutFormSchema } from '@/server/schemas/payment'

type FormData = z.infer<typeof pixCheckoutFormSchema>

type PixFormProps = {
  onBack: () => void
  onclose: () => void
  course: Course
}

export function PixForm({ onBack, course, onclose }: PixFormProps) {
  const router = useRouter()

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

  const { handleSubmit, watch, setError } = form

  const rawCep = watch('postalCode')

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

  const [isGenerating, setIsGenerating] = useState(false)
  const [invoiceId, setInvoiceId] = useState<string | null>(null)
  const [pixData, setPixData] = useState<PixResponse | null>(null)

  const [checkStatusIsDisabled, setCheckStatusIsDisabled] = useState(false)

  const { mutate: handleGetQrCode } = useMutation({
    mutationFn: getPixQrCode,
    onSuccess: data => {
      setPixData(data)
      setIsGenerating(false)
    },
    onError: () => {
      setIsGenerating(false)
      toast.error('Erro ao carregar QRCode. Tente fechar e abrir novamente.')
    },
  })

  const { mutateAsync: handleGetStatus, isPending: isLoadingStatus } = useMutation({
    mutationFn: getInvoiceStatus,
  })

  const { mutateAsync: handleCreateInvoice, isPending: isCreatingInvoice } = useMutation({
    mutationFn: createCheckoutPix,
    onSuccess: async response => {
      setIsGenerating(true)
      setStep(2)
      setInvoiceId(response.invoiceId)
      handleGetQrCode(response.invoiceId)
    },
    onError: error => {
      if (error?.name === 'CONFLICT') {
        toast.warning('Você já possui acesso a este curso.')
        onclose()
        return
      }

      toast.error('Erro ao gerar QRCode, tente novamente.')
      onBack()
    },
  })

  async function onSubmit(data: FormData) {
    const isValidCep = await handleValidateCep()

    if (!isValidCep) return

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

  function handleCopy() {
    if (!pixData) return

    navigator.clipboard.writeText(pixData?.payload)

    toast.success('Código copiado para a área de transferência')
  }

  async function handleConfirmPayment() {
    if (!invoiceId) return

    if (checkStatusIsDisabled) {
      toast.error('Aguarde um momento antes de verificar o status novamente!')
      return
    }

    setCheckStatusIsDisabled(true)
    setTimeout(() => setCheckStatusIsDisabled(false), 5000)

    const { status } = await handleGetStatus(invoiceId)

    switch (status) {
      case 'PENDING':
        toast.info(
          'Pagamento em processamento. Caso haja instabilidade poderá levar alguns minutos, mas não se preocupe, o curso será adicionado automaticamente à sua conta.'
        )
        break

      case 'RECEIVED':
        toast.success('Pagamento efetuado com sucesso!')
        onclose()
        toast.success('Agradecemos por sua compra! Você será redirecionado para o curso em instantes.')

        await new Promise(resolve => setTimeout(resolve, 4000))
        router.push(`/courses/${course.slug}`)
        break
    }
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
            <>
              <div className="mx-auto mt-2 flex aspect-square w-75 items-center justify-center bg-primary p-3">
                {isGenerating ? (
                  <Skeleton className="h-full w-full" />
                ) : pixData?.encodedImage ? (
                  // biome-ignore lint/performance/noImgElement: <false>
                  <img
                    className="h-full w-full object-contain"
                    src={`data:image/png;base64,${pixData.encodedImage}`}
                    alt="QRCode do Pix"
                  />
                ) : (
                  <p className="text-center text-sm text-white opacity-70">Não foi possível carregar o QRCode</p>
                )}
              </div>

              <p className="my-4 px-12 text-center">Escaneie o QRCode acima ou copie e cole o código no seu app bancário</p>

              <div className="flex w-full max-w-125 gap-2">
                <Input placeholder="Gerando QRCode..." value={pixData?.payload ?? ''} readOnly />
                <Button type="button" disabled={!pixData} onClick={handleCopy}>
                  Copiar <Copy />
                </Button>
              </div>
            </>
          </>
        )}

        <div className="mt-6 flex w-full flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
          <Button variant="outline" className="w-full md:w-max" onClick={handleBack} type="button">
            <ArrowLeft />
            Voltar
          </Button>

          {step === 1 ? (
            <Button type="submit" className="w-full md:w-max" disabled={isCreatingInvoice || isValidatingCep}>
              Continuar
              <ArrowRight />
            </Button>
          ) : (
            <Button
              type="button"
              className="w-full md:w-max"
              disabled={!pixData || isLoadingStatus}
              onClick={handleConfirmPayment}
            >
              Confirmar pagamento
              <Check />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
