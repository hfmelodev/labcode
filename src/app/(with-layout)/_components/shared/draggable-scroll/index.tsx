'use client'

import { type ComponentProps, type RefObject, useRef } from 'react'
import { useDraggable } from 'react-use-draggable-scroll'

type DraggableScrollProps = ComponentProps<'div'>

export function DraggableScroll({ ...props }: DraggableScrollProps) {
  // Busca o elemento para ser arrastado
  const ref = useRef<HTMLDivElement>(null)
  // Busca as funções do react-use-draggable
  const { events } = useDraggable(ref as RefObject<HTMLDivElement>)
  // Renderiza o componente DraggableScroll com as propriedades e eventos
  return <div {...props} {...events} ref={ref} />
}
