import { DialogContent, DialogHeader, Dialog as DialogRoot, DialogTitle, DialogTrigger } from './primitives'

type DialogProps = {
  open?: boolean
  setOpen?: (open: boolean) => void
  title?: string
  children?: React.ReactNode
  content: React.ReactNode
  width?: string
  height?: string
  preventOutsideClick?: boolean
}

export function Dialog({
  open,
  setOpen,
  title,
  children,
  content,
  width = '600px',
  height = '90vh',
  preventOutsideClick,
}: DialogProps) {
  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent
        style={{ maxWidth: width, maxHeight: height }}
        className="overflow-y-auto0"
        onInteractOutside={event => {
          if (preventOutsideClick) event.preventDefault(), event.stopPropagation()
        }}
      >
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}

        {content}
      </DialogContent>
    </DialogRoot>
  )
}
