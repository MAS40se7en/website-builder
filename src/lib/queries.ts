'use server';

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import prisma from "./db";
import { redirect } from "next/navigation";
import { User } from "@/generated/prisma";

const client = await clerkClient();

export const getAuthUserDetails = async () => {
    const user = await currentUser();

    if (!user) {
        return
    }

    const userData = prisma.user.findUnique({
        where: {
            email: user.emailAddresses[0].emailAddress
        },
        include: {
            agency: {
                include: {
                    SidebarOption: true,
                    SubAccount: {
                        include: {
                            SidebarOption: true
                        }
                    }
                }
            },
            Permissions: true
        }
    })

    return userData
}

export const createTeamUser = async (agencyId: string, user: User) => {
    if (user.role === 'AGENCY_OWNER') {
        return null
    }

    const response = await prisma.user.create({
        data: { ...user }
    })

    return response
}

export const saveActivityLogsNotification = async ({
    agencyId,
    description,
    subAccountId
}: {
    agencyId?: string,
    description: string,
    subAccountId?: string
}) => {
    const authUser = await currentUser()

    let userData;

    if (!authUser) {
        const response = await prisma.user.findFirst({
            where: {
                Agency: {
                    SubAccount: {
                        some: {
                            id: subAccountId
                        }
                    }
                }
            }
        })

        if (response) {
            userData = response
        }
    } else {
        userData = await prisma.user.findUnique({
            where: {
                email: authUser?.emailAddresses[0].emailAddress
            }
        })
    }

    if (!userData) {
        console.log("could not find a user")

        return
    }

    let foundAgencyId = agencyId

    if (!foundAgencyId) {
        if (!subAccountId) {
            throw new Error(
                'You need to provide atleast an agency Id or subaccount Id'
            )
        }

        const response = await prisma.subAccount.findUnique({
            where: {
                id: subAccountId
            }
        })

        if (response) {
            foundAgencyId = response.agencyId
        }
    }

    if (subAccountId) {
        await prisma.notification.create({
            data: {
                notification: `${userData.name} | ${description}`,
                User: {
                    connect: {
                        id: userData.id
                    }
                },
                Agency: {
                    connect: {
                        id: foundAgencyId
                    }
                },
                SubAccount: {
                    connect: {
                        id: subAccountId
                    }
                }
            }
        })
    } else {
        await prisma.notification.create({
            data: {
                notification: `${userData.name} | ${description}`,
                User: {
                    connect: {
                        id: userData.id
                    }
                },
                Agency: {
                    connect: {
                        id: foundAgencyId
                    }
                }
            }
        })
    }
}

export const verifyAndAcceptInvitation = async () => {
    const user = await currentUser()

    if (!user) {
        redirect('/sign-in')
    }

    const invitationExists = await prisma.invitation.findUnique({
        where: {
            email: user.emailAddresses[0].emailAddress,
            status: 'PENDING'
        }
    })

    if (invitationExists) {
        const userDetails = await createTeamUser(invitationExists.agencyId, {
            email: invitationExists.email,
            agencyId: invitationExists.agencyId,
            avatarUrl: invitationExists.avatarUrl,
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            role: invitationExists.role,
            createdAt: new Date(),
            updatedAt: new Date(),

        })

        await saveActivityLogsNotification({
            agencyId: invitationExists?.agencyId,
            description: 'Joined',
            subAccountId: undefined
        })

        if (userDetails) {
            await client.users.updateUserMetadata(user.id, {
                privateMetadata: {
                    role: userDetails.role || "SUBACCOUNT_USER"
                }
            })

            await prisma.invitation.delete({
                where: {
                    email: userDetails.email
                }
            })

            return userDetails.agencyId
        } else {
            return null
        }

    } else {
        const agency = await prisma.user.findUnique({
            where: {
                email: user.emailAddresses[0].emailAddress
            }
        })

        return agency ? agency.agencyId : null
    }



}