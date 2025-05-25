import { getAuthUserDetails } from "@/lib/queries"
import MenuOptions from "./menu-options"

type Props = {
    id: string
    type: 'agency' | 'subaccount'
}

const Sidebar = async ({ id, type }: Props) => {
    const user = await getAuthUserDetails()

    if (!user) return null

    if (!user?.Agency) return

    const details = type === 'agency' ? user?.Agency : user?.Agency?.SubAccount.find((subaccount) => subaccount.id === id)

    const isWhiteLabeledAgency = user?.Agency?.whiteLabel

    if (!details) return

    let sideBarLogo = user.Agency?.agencyLogo || "/logo.png"

    if (!isWhiteLabeledAgency) {
        if (type === "subaccount") {
            sideBarLogo = user.Agency.SubAccount.find((subAccount) => subAccount.id === id)?.subAccountLogo || user.Agency?.agencyLogo
        }
    }

    const sidebarOut = type === 'agency' ? user.Agency.SidebarOption || [] : user.Agency?.SubAccount.find((subaccount) => subaccount.id === id)?.SidebarOption || []

    const subaccounts = user.Agency.SubAccount.filter((subaccount) => user.Permissions.find(
        (permission) =>
            permission.subAccountId === subaccount
                .id && permission.access
    ))
    return (
        <>
            <MenuOptions defaultOpen={true} details={details} id={id} sidebarLogo={sideBarLogo} subAccounts={subaccounts} sidebarOpt={sidebarOut} user={user} />
            <MenuOptions details={details} id={id} sidebarLogo={sideBarLogo} subAccounts={subaccounts!} sidebarOpt={sidebarOut} user={user} />
        </>
    )
}

export default Sidebar