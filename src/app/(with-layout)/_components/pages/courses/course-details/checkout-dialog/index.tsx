'use client'

import 'react-credit-cards-2/dist/es/styles-compiled.css'

import { ArrowRight, CreditCard } from 'lucide-react'
import { useState } from 'react'
import { FaPix } from 'react-icons/fa6'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { CreditCardForm } from './credit-card'
import { PixForm } from './pix'

type CheckoutDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  course: Course
}

const paymentMethods = [
  {
    label: 'Pix',
    value: 'PIX' as const,
    icon: FaPix,
  },
  {
    label: 'Cartão de crédito',
    value: 'CREDIT_CARD' as const,
    icon: CreditCard,
  },
]

export function CheckoutDialog({ open, setOpen, course }: CheckoutDialogProps) {
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX')

  function handleContinue() {
    // TODO: Valida se o usuário já esta logado

    setStep(2)
  }

  function handleBack() {
    setStep(1)
  }

  return (
    <Dialog
      open={open}
      setOpen={setOpen}
      height="95vh"
      title="Concluir compra"
      preventOutsideClick
      content={
        <div className="pt-4">
          {/* Conteúdo do passo 1 */}
          {step === 1 && (
            <div className="flex flex-col">
              <h2 className="mb-3">Métodos de pagamento</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {paymentMethods.map(method => (
                  <Button
                    key={method.value}
                    variant="outline"
                    onClick={() => setPaymentMethod(method.value)}
                    className={cn(
                      'flex h-auto w-full items-center justify-center gap-3 p-4 font-semibold text-[14px] disabled:opacity-50',
                      paymentMethod === method.value && 'border-primary! bg-primary/10! text-primary hover:text-primary'
                    )}
                  >
                    <method.icon className="h-6 min-h-6 w-6 min-w-6" />
                    {method.label}
                  </Button>
                ))}
              </div>

              <Button className="mt-6 ml-auto" onClick={handleContinue}>
                Continuar
                <ArrowRight />
              </Button>
            </div>
          )}

          {/* Conteúdo do passo 2 */}
          {step === 2 && paymentMethod === 'CREDIT_CARD' && <CreditCardForm onBack={handleBack} />}
          {step === 2 && paymentMethod === 'PIX' && <PixForm onBack={handleBack} />}
        </div>
      }
    />
  )
}
