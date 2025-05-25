'use client'

import { useModal } from '@/providers/modal-provider'
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

type Props = {
    title: string
    subheading: string
    children: React.ReactNode
    defaultOpen?: boolean
}
const CustomModal = ({title, subheading, children, defaultOpen}: Props) => {
    const { isOpen, setClose } = useModal()

  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
        <DialogContent className='overflow-scroll max-h-[700px] md:h-fit h-screen bg-card'>
            <DialogHeader className="text-left pt-8">
                <DialogTitle className='text-2xl font-bold'>{title}</DialogTitle>
                <DialogDescription>{subheading}</DialogDescription>
            </DialogHeader>
            {children}
        </DialogContent>
    </Dialog>
  )
}

export default CustomModal