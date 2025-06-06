import AgencyDetails from '@/components/forms/AgencyDetails'
import { Plan } from '@/app/generated/prisma'
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async ({ searchParams }: { searchParams: { plan: Plan; state: string; code: string } }) => {


    const agencyId = await verifyAndAcceptInvitation()

    //get user details
    const user = await getAuthUserDetails()

    if (agencyId) {
        if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
            return redirect('/subaccount')
        } else if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
            if (searchParams.plan) {
                return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`)
            }

            if (searchParams.state) {
                const statePath = searchParams.state.split('___')[0]

                const stateAgencyId = searchParams.state.split('___')[1]

                if (!stateAgencyId) {
                    return <div>Not Authorized</div>
                }

                return redirect(`/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`)
            }else {
            return redirect(`/agency/${agencyId}`)
        }
        } else {
        return <div>Not Authorized</div>
    }
    } 

    const authUser = await currentUser()

    return (
        <div className='flex justify-center items-center mt-4'>
            <div className='max-w-[850px] border-[1px] p-4 rounded-xl flex flex-col gap-5'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-4xl text-center font-semibold'>Create an Agency</h1>
                    <Link href='/' className='bg-foreground text-background py-2 px-3 rounded-md font-semibold hover:bg-foreground/90 active:bg-foreground/80 cursor-pointer'>back home</Link>
                </div>
                <AgencyDetails data={{companyEmail:authUser?.emailAddresses[0].emailAddress}} />
            </div>
        </div>
    )
}

export default page