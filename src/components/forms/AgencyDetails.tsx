'use client'

import { Agency } from '@/app/generated/prisma'
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FileUpload from '../global/file-upload'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { deleteAgency, initUser, saveActivityLogsNotification, updateAgencyDetails, upsertAgency } from '@/lib/queries'
import { NumberInput } from '@tremor/react';
import { Button } from '../ui/button'
import { Icon } from '@iconify/react'
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from '../ui/alert-dialog';
import { v4 } from 'uuid'

type Props = {
    data?: Partial<Agency>
}

const FormSchema = z.object({
    name: z.string().min(2, { message: 'Agency name must be at least 2 characters.' }),
    companyEmail: z.string().min(1, { message: 'Company email is required.' }),
    companyPhone: z.string().min(1, { message: 'Company phone is required.' }),
    whiteLabel: z.boolean(),
    address: z.string().min(1, { message: 'Address is required.' }),
    city: z.string().min(1, { message: 'City is required.' }),
    zipCode: z.string().min(1, { message: 'Zip code is required.' }),
    state: z.string().min(1, { message: 'State is required.' }),
    country: z.string().min(1, { message: 'Country is required.' }),
    agencyLogo: z.string().optional()//.min(1, { message: 'Agency logo is required.' }),
})

const AgencyDetails = ({ data }: Props) => {
    const router = useRouter()
    const [deletingAgency, setDeletingAgency] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        mode: "onChange",
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: data?.name || '',
            companyEmail: data?.companyEmail || '',
            companyPhone: data?.companyPhone || '',
            whiteLabel: data?.whiteLabel,
            address: data?.address || '',
            city: data?.city || '',
            zipCode: data?.zipCode || '',
            state: data?.state || '',
            country: data?.country || '',
            agencyLogo: data?.agencyLogo || '',
        }
    })

    useEffect(() => {
        if (data) {
            form.reset(data)
        }
    }, [data])

    const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
        console.log(values);
        setIsLoading(true)

        try {
            let newUserData;
            let customerId;

            if (!data?.id) {
                const bodyData = {
                    email: values.companyEmail,
                    name: values.name,
                    shipping: {
                        address: {
                            city: values.city,
                            country: values.country,
                            line1: values.address,
                            postal_code: values.zipCode,
                            state: values.state
                        },
                        name: values.name,
                    },
                    address: {
                        city: values.city,
                        country: values.country,
                        line1: values.address,
                        postal_code: values.zipCode,
                        state: values.state
                    }
                }
            }

            // TODO: custId
            newUserData = await initUser({ role: 'AGENCY_OWNER' })

            if (!data?.id) {
                await upsertAgency({
                    id: data?.id ? data.id : v4(),
                    address: values.address,
                    agencyLogo: values.agencyLogo || '',
                    city: values.city,
                    companyPhone: values.companyPhone,
                    companyEmail: values.companyEmail,
                    country: values.country,
                    name: values.name,
                    state: values.state,
                    zipCode: values.zipCode,
                    whiteLabel: values.whiteLabel,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    connectAccountId: "",
                    goal: 5
                });

                toast.success("Saved Agency Details", {
                    description: "Saved your agency details",
                });

                return router.refresh()
            }
        } catch (error) {
            console.log("error saving agency details", error)
            toast.error("Oops!!", {
                description: "Could not save your agency details",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAgency = async () => {
        if (!data?.id) {
            return
        }

        setDeletingAgency(true)
        // TODO: Add delete agency api endpoint and discontinue subscription

        try {
            await deleteAgency(data?.id)
            toast.success("Deleted Agency", {
                description: "Deleted your agency and all subaccounts",
            })
            router.refresh()

        } catch (error) {
            console.log(error)
            toast.error("Oops!!", {
                description: "Could not delete your agency",
            })
        } finally {
            setDeletingAgency(false)
        }
    }

    return (
        <AlertDialog>
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Agency information</CardTitle>
                    <CardDescription>
                        Lets create an agency for your business. You can edit agency settings later from the settings tab.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className='space-y-4'
                        >
                            <FormField disabled={isLoading} control={form.control} name="agencyLogo" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Agency Logo</FormLabel>
                                    <FormControl>
                                        <FileUpload apiEndpoint='agencyLogo'
                                            onChange={field.onChange}
                                            value={field.value}
                                        ></FileUpload>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className='flex md:flex-row gap-4'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your agency name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="companyEmail"
                                    render={({ field }) =>
                                        <FormItem className='flex-1'>
                                            <FormLabel>Agency Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter your agency email'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    }
                                />
                            </div>
                            <div className='flex md:flex-row gap-4'>
                                <FormField
                                    control={form.control}
                                    name="companyPhone"
                                    render={({ field }) =>
                                        <FormItem className='flex-1'>
                                            <FormLabel>Agency Phone Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter your agency phone number'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    }
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name='whiteLabel'
                                render={({ field }) => {
                                    return (
                                        <FormItem className='flex flex-row items-center justify-between rounded-lg border gap-4 p-4'>
                                            <div>
                                                <FormLabel>Whitelabel Agency</FormLabel>
                                                <FormDescription>
                                                    Turning on whitelabel mode will show your agency logo to all sub accounts by default. You can overwrite this functionality through sub account settings.
                                                </FormDescription>
                                            </div>

                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) =>
                                    <FormItem className='flex-1'>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='123 st...'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                }
                            />
                            <div className='flex md:flex-row gap-4'>
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) =>
                                        <FormItem className='flex-1'>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='City'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    }
                                />
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) =>
                                        <FormItem className='flex-1'>
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='State'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    }
                                />
                                <FormField
                                    control={form.control}
                                    name="zipCode"
                                    render={({ field }) =>
                                        <FormItem className='flex-1'>
                                            <FormLabel>Zipcode</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Zipcode'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    }
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) =>
                                    <FormItem className='flex-1'>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Country'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                }
                            />

                            <div className='flex flex-col gap-2'>
                                {data?.id && (
                                    <div>
                                        <FormLabel>Create Goals</FormLabel>
                                        <FormDescription>
                                            Create a goal for your agency. As your business grows your goals grow too so dont forget to set the bar higher!
                                        </FormDescription>

                                        <NumberInput
                                            defaultValue={data?.goal}
                                            onValueChange={async (val) => {
                                                if (!data?.id) { return }
                                                await updateAgencyDetails(data.id, { goal: val })
                                                await saveActivityLogsNotification({
                                                    agencyId: data?.id,
                                                    description: `Updated their goal to ${val}`,
                                                    subAccountId: undefined
                                                })
                                                router.refresh()
                                            }}
                                            min={1}
                                            className="bg-background !border !border-input px-3 rounded-lg"
                                            placeholder='Subaccount Goal'
                                        />
                                    </div>
                                )}
                                <Button type='submit' disabled={isLoading}>
                                    {isLoading && (
                                        <Icon icon="codex:loader" className='mr-2 h-4 w-4 animate-spin' />
                                    )}
                                    Save Agency Information
                                </Button>
                            </div>

                        </form>

                    </Form>
                    {data?.id && (
                        <div className='flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4'>
                            <div>
                                <div>
                                    Danger Zone
                                </div>
                                <div className='text-muted-foreground'>
                                    Deleting your agency cannot be undone. This will also delete all sub accounts. Sub accounts will no longer have access to funnels, contacts, etc.
                                </div>
                            </div>
                            <AlertDialogTrigger className='text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap'
                                disabled={isLoading || deletingAgency}>
                                {deletingAgency ? "Deleting..." : "Delete Agency"}
                            </AlertDialogTrigger>
                        </div>
                    )}

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className='text-left'>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className='text-left'>
                                This action cannot be undone. This will permanently delete the Agency account and all related sub accounts.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex items-center">
                            <AlertDialogCancel className='mb-2'>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                disabled={deletingAgency}
                                className='bg-destructive hover:bg-destructive'
                                onClick={handleDeleteAgency}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </CardContent>
            </Card>
        </AlertDialog>
    )
}

export default AgencyDetails