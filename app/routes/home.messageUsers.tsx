import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react"
import { requireUserId } from "~/utils/auth.server";
import { getOtherUsers } from "~/utils/user.server";
import { UserPanel } from "~/components/user-panel";

export const loader: LoaderFunction = async ({request}) => {
    const userId = await requireUserId(request)
    const users = await getOtherUsers(userId)

    return json({ users })
}

export default function MessageUsers(){
    const {users} = useLoaderData();
    return <UserPanel users={users} />
}