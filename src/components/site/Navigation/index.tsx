import { currentUser, User } from '@clerk/nextjs/server'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { ModeToggle } from '@/components/global/ModeToggle'

type Props = {
    user?: null | User
}

const Navigation = async () => {
    const user: Props['user'] = await currentUser()
  return (
    <div className='p-4 flex items-center justify-between fixed top-0 right-0 left-0 z-50 bg-background'>
        <aside className='flex items-center gap-2 h-10'>
            <Image
                src={'/logo.png'}
                alt="logo"
                height={40}
                width={40}
                className='h-5 w-16'
            />
            
        </aside>
        <nav className='hidden md:block absolute left-[50%] top-[40%] transform translate-x-[-50%] translate-y-0-[-50%]'>
            <ul className='flex items-center justify-center gap-8'>
                <Link href={'#'}>Pricing</Link>
                <Link href={'#'}>About</Link>
                <Link href={'#'}>Documentation</Link>
                <Link href={'#'}>Features</Link>
            </ul>
        </nav>
        <aside className='flex gap-2 items-center'>
            {!user && <Link href={'/sign-in'} className='bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80'>
                Login
            </Link>}
            <UserButton />
            <ModeToggle />
        </aside>
    </div>
  )
}

export default Navigation