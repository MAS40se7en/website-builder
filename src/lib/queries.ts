'use server';

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";
import { redirect } from "next/navigation";
import { Agency, Icon, Plan, SubAccount, User } from "@/app/generated/prisma";
import { icons } from "./constants";
import { v4 } from "uuid";

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
            Agency: {
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
            foundAgencyId = response.AgencyId
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
            avatarUrl: invitationExists.avatarUrl || '',
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

export const updateAgencyDetails = async (agencyId: string, agencyDetails: Partial<Agency>) => {
    const response = await prisma.agency.update({
        where: {
            id: agencyId
        },
        data: { ...agencyDetails }
    })

    return response
}

export const deleteAgency = async (agencyId: string) => {
    const response = await prisma.agency.delete({
        where: {
            id: agencyId
        }
    })

    return response
}

export const initUser = async (newUser: Partial<User>) => {
    const user = await currentUser();

    if (!user) {
        return
    }

    const userData = await prisma.user.upsert({
        where: {
            email: user.emailAddresses[0].emailAddress,
        },
        update: newUser,
        create: {
            id: user.id,
            avatarUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName} ${user.lastName}`,
            role: newUser.role || 'SUBACCOUNT_USER',
        },
    })

    await client.users.updateUserMetadata(user.id, {
        privateMetadata: {
            role: newUser.role || "SUBACCOUNT_USER"
        }
    })

    return userData
}

export const upsertAgency = async (agency: Agency, price?: Plan) => {
    if (!agency.companyEmail) {
        return null
    }

    try {
        const agencyDetails = await prisma.agency.upsert({
            where: {
                id: agency.id,
            },
            update: agency,
            create: {
                users: {
                    connect: { email: agency.companyEmail },
                },
                ...agency,
                SidebarOption: {
                    create: [
                        {
                            name: "Dashboard",
                            icon: icons.category,
                            link: `/agency/${agency.id}`
                        },
                        {
                            name: "Launchpad",
                            icon: icons.clipboardIcon,
                            link: `/agency/${agency.id}/launchpad`
                        },
                        {
                            name: "Billing",
                            icon: icons.payment,
                            link: `/agency/${agency.id}/billing`
                        },
                        {
                            name: "Settings",
                            icon: icons.settings,
                            link: `/agency/${agency.id}/settings`
                        },
                        {
                            name: "Sub Account",
                            icon: icons.person,
                            link: `/agency/${agency.id}/all-subaccounts`
                        },
                        {
                            name: "Team",
                            icon: icons.shield,
                            link: `/agency/${agency.id}/team`
                        }
                    ]
                }
            }
        })

        return agencyDetails
    } catch (error) {
        console.log("Error: could not create customer", error)

    }
}

export const getNotificationAndUser = async (agencyId: string) => {
    try {
        const response = await prisma.notification.findMany({
            where: { agencyId },
            include: { User: true },
            orderBy: { createdAt: 'desc' }
        })

        return response
    } catch (error) {
        console.log(error)
    }
}

export const upsertSubaccount = async (subAccount: SubAccount) => {
    if (!subAccount.companyEmail) {
        return null
    }

    const agencyOwner = await prisma.user.findFirst({
        where: {
            role: 'AGENCY_OWNER',
            Agency: {
                id: subAccount.AgencyId
            }
        },
    })

    if (!agencyOwner) {
        return console.log("Error: could not find agency owner")
    }

    const permissionId = v4()

    const response = await prisma.subAccount.upsert({
        where: {
            id: subAccount.id,
        },
        update: subAccount,
        create: {
            ...subAccount,
            Permissions: {
                create: {
                    access: true,
                    email: agencyOwner.email,
                    id: permissionId
                },
                connect: {
                    subAccountId: subAccount.id,
                    id: permissionId
                }
            },
            Pipeline: {
                create: {
                    name: "Lead Cycle"
                }
            },
            SidebarOption: {
                create: [
                    {
                        name: "Launchpad",
                        icon: icons.clipboardIcon,
                        link: `/subaccount/${subAccount.id}/launchpad`
                    },
                    {
                        name: "Settings",
                        icon: icons.settings,
                        link: `/subaccount/${subAccount.id}/settings`
                    },
                    {
                        name: "Funnels",
                        icon: icons.pipelines,
                        link: `/subaccount/${subAccount.id}/funnels`
                    },
                    {
                        name: "Media",
                        icon: icons.database,
                        link: `/subaccount/${subAccount.id}/media`
                    },
                    {
                        name: "Automation",
                        icon: icons.chip,
                        link: `/subaccount/${subAccount.id}/automation`
                    },
                    {
                        name: "Pipelines",
                        icon: icons.pipelines,
                        link: `/subaccount/${subAccount.id}/pipelines`
                    },
                    {
                        name: "Contacts",
                        icon: icons.person,
                        link: `/subaccount/${subAccount.id}/contacts`
                    },
                    {
                        name: "Dashboard",
                        icon: icons.category,
                        link: `/subaccount/${subAccount.id}`
                    }
                ]
            }
        }
    });

    return response;
}