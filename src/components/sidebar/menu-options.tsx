'use client'

import { Agency, AgencySideBarOption, SubAccount, SubAccountSidebarOption } from "@/app/generated/prisma"
import { useEffect, useMemo, useState } from "react"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet"
import { Button } from "../ui/button"
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from "lucide-react"
import clsx from "clsx"
import { AspectRatio } from "../ui/aspect-ratio"
import Image from "next/image"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import Link from "next/link"
import { useModal } from "@/providers/modal-provider"
import CustomModal from "../global/custom-modal"
import SubaccountDetails from "../forms/SubaccountDetails"
import { Separator } from "../ui/separator"
import { findIconByValue } from "@/lib/utils"
import { Icon } from "@iconify/react"

type Props = {
    defaultOpen?: boolean
    subAccounts: SubAccount[]
    sidebarOpt: AgencySideBarOption[] | SubAccountSidebarOption[]
    sidebarLogo: string
    details: Agency | SubAccount
    user: any
    id: string
}

const MenuOptions = ({
    defaultOpen,
    subAccounts,
    sidebarOpt,
    sidebarLogo,
    details,
    user,
    id
}: Props) => {
    const { setOpen } = useModal()

    const [isMounted, setIsMounted] = useState(false)

    const openState = useMemo(() => (defaultOpen ? { open: true } : {}),
        [defaultOpen]
    )

    useEffect(() => {
        setIsMounted(true)
    }, [])


    return (
        <Sheet modal={false} {...openState}>
            <SheetTrigger asChild className="absolute left-4 top-4 z-[100] flex md:hidden">
                <Button variant={"outline"} size={"icon"}>
                    <Menu />
                </Button>
            </SheetTrigger>

            <SheetContent showX={!defaultOpen} side="left" className={clsx("bg-background backdrop-blur-xl fixed top-0 border-r-[1px] p-6", { 'hidden md:inline-block z-[200] w-[300px]': defaultOpen, 'inline-block md:hidden z-[100] w-full': !defaultOpen })}>
                <div>
                    <AspectRatio ratio={16 / 5}>
                        <Image
                            src={sidebarLogo}
                            alt="sidebar logo"
                            fill
                            className="rounded-md object-contain"
                        />
                    </AspectRatio>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="w-full my-4 flex items-center justify-between py-8" variant={"ghost"}>
                                <div className="flex items-center text-left gap-2">
                                    <Compass />
                                    <div className="flex flex-col">
                                        {details.name}
                                        <span className="text-muted-foreground">
                                            {details.address}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <ChevronsUpDown
                                        size={16}
                                        className="text-muted-foreground"
                                    />
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 h-80 mt-4 z-[200]">
                            <Command className="rounded-lg">
                                <CommandInput placeholder="Search Accounts..." />
                                <CommandList className="pb-16">
                                    <CommandEmpty>No results found</CommandEmpty>
                                    {(user?.role === 'AGENCY_OWNER' || user?.role === 'AGENCY_ADMIN') && user?.Agency && (
                                        <CommandGroup heading="Agency">
                                            <CommandItem className="!bg-transparent my-2 text-primary border-[1px] border-border p-2 rounded-md hover:bg-muted cursor-pointer transition-all">
                                                {defaultOpen ? (
                                                    <Link
                                                        href={`/agency/${user?.Agency?.id}`}
                                                        className="flex gap-4 w-full h-full"
                                                    >
                                                        <div className="relative w-16">
                                                            <Image
                                                                src={user?.Agency?.logo}
                                                                alt="logo"
                                                                fill
                                                                className="rounded-md object-contain"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col flex-1">
                                                            {user?.Agency?.name}
                                                            <span className="text-muted-foreground">
                                                                {user?.Agency?.address}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                )
                                                    :
                                                    (
                                                        <SheetClose asChild>
                                                            <Link
                                                                href={`/agency/${user?.Agency?.id}`}
                                                                className="flex gap-4 w-full h-full"
                                                            >
                                                                <div className="relative w-16">
                                                                    <Image
                                                                        src={user?.Agency?.logo}
                                                                        alt="logo"
                                                                        fill
                                                                        className="rounded-md object-contain"
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col flex-1">
                                                                    {user?.Agency?.name}
                                                                    <span className="text-muted-foreground">
                                                                        {user?.Agency?.address}
                                                                    </span>
                                                                </div>
                                                            </Link>
                                                        </SheetClose>
                                                    )
                                                }
                                            </CommandItem>
                                        </CommandGroup>
                                    )}
                                    <CommandGroup heading="Accounts">
                                        {!!subAccounts ? subAccounts.map((subaccount) => (
                                            <CommandItem key={subaccount.id}>
                                                {defaultOpen ? (
                                                    <Link
                                                        href={`/subaccount/${subaccount.id}`}
                                                        className="flex gap-4 w-full h-full"
                                                    >
                                                        <div className="relative w-16">
                                                            <Image
                                                                src={subaccount.subAccountLogo}
                                                                alt="logo"
                                                                fill
                                                                className="rounded-md object-contain"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col flex-1">
                                                            {subaccount.name}
                                                            <span className="text-muted-foreground">
                                                                {subaccount.address}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                )
                                                    :
                                                    (
                                                        <SheetClose asChild>
                                                            <Link
                                                                href={`/subaccount/${subaccount.id}`}
                                                                className="flex gap-4 w-full h-full"
                                                            >
                                                                <div className="relative w-16">
                                                                    <Image
                                                                        src={subaccount.subAccountLogo}
                                                                        alt="logo"
                                                                        fill
                                                                        className="rounded-md object-contain"
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col flex-1">
                                                                    {subaccount.name}
                                                                    <span className="text-muted-foreground">
                                                                        {subaccount.address}
                                                                    </span>
                                                                </div>
                                                            </Link>
                                                        </SheetClose>
                                                    )
                                                }
                                            </CommandItem>
                                        ))
                                            :
                                            'No Accounts found!'
                                        }
                                    </CommandGroup>
                                </CommandList>
                                {(user?.role === 'AGENCY_ADMIN' || user?.role === 'AGENCY_OWNER') && (
                                    <SheetClose>
                                        <Button className="w-full flex gap-2" onClick={() => {
                                            setOpen(
                                                <CustomModal title="Create A Subaccount" subheading="just fill the details and we will take care of the rest">
                                                    <SubaccountDetails
                                                        agencyDetails={user?.agency as Agency}
                                                        userId={user?.id as string}
                                                        userName={user?.name}
                                                    />
                                                </CustomModal>
                                            )
                                        }}>
                                            <PlusCircleIcon size={15} />
                                            Create Sub Account
                                        </Button>
                                    </SheetClose>
                                )}
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <p className="text-muted-foreground text-xs mb-2">
                        <Separator className="mb-4" />
                        <nav className="relative">
                            <Command className="rounded-lg overflow-visible bg-transparent">
                                <CommandInput placeholder="search..." />
                                <CommandList className="py-4 overflow-visible">
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    <CommandGroup className="overflow-visible">
                                        {sidebarOpt.map((sidebarOptions) => {
                                            let val
                                            const result = findIconByValue(sidebarOptions.icon)

                                            if (result) {
                                                val = <Icon icon={result.icon} width={20} height={20} />
                                            }

                                            return (
                                                <CommandItem key={sidebarOptions.id}
                                                className="md:w-[320px] w-full">
                                                    <Link
                                                        href={sidebarOptions.link}
                                                        className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all md:w-full w-[320px]"
                                                    >
                                                        {val}
                                                        <span>{sidebarOptions.name}</span>
                                                    </Link>
                                                </CommandItem>
                                            )
                                        })}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </nav>
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default MenuOptions