'use client'

import { Agency, SubAccount } from '@/app/generated/prisma'
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FileUpload from '../global/file-upload'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Icon } from '@iconify/react'
import { v4 } from 'uuid'
import { useModal } from '@/providers/modal-provider'
import { upsertSubaccount } from '@/lib/queries'

interface SubaccountDetailsProps {
    agencyDetails: Agency
    details?: Partial<SubAccount>
    userId: string
    userName: string
}

const FormSchema = z.object({
    name: z.string().min(2, { message: 'Agency name must be at least 2 characters.' }),
    companyEmail: z.string().min(1, { message: 'Company email is required.' }),
    companyPhone: z.string().min(1, { message: 'Company phone is required.' }),
    address: z.string().min(1, { message: 'Address is required.' }),
    city: z.string().min(1, { message: 'City is required.' }),
    zipCode: z.string().min(1, { message: 'Zip code is required.' }),
    state: z.string().min(1, { message: 'State is required.' }),
    country: z.string().min(1, { message: 'Country is required.' }),
    subAccountLogo: z.string().min(1, { message: 'Agency logo is required.' }),
})

const SubaccountDetails: React.FC<SubaccountDetailsProps> = ({ 
    details,
    userId,
    userName,
    agencyDetails
 }) => {
    const router = useRouter()
    const {setClose} = useModal()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        mode: "onChange",
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: details?.name || '',
            companyEmail: details?.companyEmail || '',
            companyPhone: details?.companyPhone || '',
            address: details?.address || '',
            city: details?.city || '',
            zipCode: details?.zipCode || '',
            state: details?.state || '',
            country: details?.country || '',
            subAccountLogo: details?.subAccountLogo || '',
        }
    })

    const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
        console.log(values);
        setIsLoading(true)

        try {
                const repsonse = await upsertSubaccount({
                    id: details?.id ? details.id : v4(),
                    address: values.address,
                    subAccountLogo: values.subAccountLogo || '',
                    city: values.city,
                    companyPhone: values.companyPhone,
                    companyEmail: values.companyEmail,
                    country: values.country,
                    name: values.name,
                    state: values.state,
                    zipCode: values.zipCode,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    connectAccountId: "",
                    goal: 5000,
                    AgencyId: agencyDetails.id
                });

                if (!repsonse) {
                    throw new Error("Failed to save subaccount details")
                }

                toast.success("Saved Subaccount Details", {
                    description: "Successfully saved your agency details",
                });

                setClose()
                return router.refresh()
        } catch (error) {
            console.log("error saving subaccount details", error)
            toast.error("Oops!!", {
                description: "Could not save your subaccount details",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (details) {
            form.reset(details)
        }
        
    }, [details])


    return (
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
                            <FormField disabled={isLoading} control={form.control} name="subAccountLogo" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subaccount Logo</FormLabel>
                                    <FormControl>
                                        <FileUpload             apiEndpoint='subaccountLogo'
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
                                            <FormLabel>Company Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter your company email'
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
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter your phone number'
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

                            <Button type='submit' disabled={isLoading}>
                                    {isLoading && (
                                        <Icon icon="codex:loader" className='mr-2 h-4 w-4 animate-spin' />
                                    )}
                                    Save Agency Information
                                </Button>

                        </form>

                    </Form>
                </CardContent>
            </Card>
    )
}

export default SubaccountDetails