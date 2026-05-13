'use client'

import { Primitive } from '@radix-ui/react-primitive'
import { Ban, CheckCircle2, Upload } from 'lucide-react'
import type * as React from 'react'
import * as DropzonePrimitive from '@/components/ui/dropzone/dropzone-primitive'
import { cn } from '@/lib/utils'

function Dropzone(props: React.ComponentProps<typeof DropzonePrimitive.Root>) {
  return <DropzonePrimitive.Root data-slot="dropzone" {...props} />
}

function DropzoneInput(props: React.ComponentProps<typeof DropzonePrimitive.Input>) {
  return <DropzonePrimitive.Input data-slot="dropzone-input" {...props} />
}

function DropzoneZone({ className, ...props }: React.ComponentProps<typeof DropzonePrimitive.Zone>) {
  return (
    <DropzonePrimitive.Zone
      data-slot="dropzone-zone"
      className={cn(
        'cursor-pointer border-2 border-input border-dashed p-6 shadow-sm transition-colors hover:border-accent-foreground/50 hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-[disabled]:cursor-not-allowed data-[drag-reject]:cursor-no-drop data-[no-click]:cursor-default data-[disabled]:border-inherit data-[drag-active]:border-accent-foreground/50 data-[drag-reject]:border-destructive data-[disabled]:bg-inherit data-[drag-active]:bg-accent data-[drag-reject]:bg-destructive/30 data-[disabled]:opacity-50',
        className
      )}
      {...props}
    />
  )
}

function DropzoneUploadIcon({ className, ...props }: React.ComponentProps<typeof Upload>) {
  return (
    <>
      <DropzonePrimitive.DragAccepted>
        <CheckCircle2 data-slot="dropzone-upload-icon-accepted" className={cn('size-8', className)} {...props} />
      </DropzonePrimitive.DragAccepted>
      <DropzonePrimitive.DragRejected>
        <Ban data-slot="dropzone-upload-icon-rejected" className={cn('size-8', className)} {...props} />
      </DropzonePrimitive.DragRejected>
      <DropzonePrimitive.DragDefault>
        <Upload data-slot="dropzone-upload-icon-default" className={cn('size-8', className)} {...props} />
      </DropzonePrimitive.DragDefault>
    </>
  )
}

function DropzoneGroup({ className, ...props }: React.ComponentProps<typeof Primitive.div>) {
  return <Primitive.div data-slot="dropzone-group" className={cn('grid place-items-center gap-1.5', className)} {...props} />
}

function DropzoneTitle({ className, ...props }: React.ComponentProps<typeof Primitive.h3>) {
  return (
    <Primitive.h3 data-slot="dropzone-title" className={cn('font-medium leading-none tracking-tight', className)} {...props} />
  )
}

function DropzoneDescription({ className, ...props }: React.ComponentProps<typeof Primitive.p>) {
  return <Primitive.p data-slot="dropzone-description" className={cn('text-muted-foreground text-sm', className)} {...props} />
}

function DropzoneTrigger(props: React.ComponentProps<typeof DropzonePrimitive.Trigger>) {
  return <DropzonePrimitive.Trigger data-slot="dropzone-trigger" {...props} />
}

function DropzoneAccepted(props: React.ComponentProps<typeof DropzonePrimitive.Accepted>) {
  return <DropzonePrimitive.Accepted data-slot="dropzone-accepted" {...props} />
}

function DropzoneRejected(props: React.ComponentProps<typeof DropzonePrimitive.Rejected>) {
  return <DropzonePrimitive.Rejected data-slot="dropzone-rejected" {...props} />
}

export {
  Dropzone,
  DropzoneAccepted,
  DropzoneDescription,
  DropzoneGroup,
  DropzoneInput,
  DropzoneRejected,
  DropzoneTitle,
  DropzoneTrigger,
  DropzoneUploadIcon,
  DropzoneZone,
}
