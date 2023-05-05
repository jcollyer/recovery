import { LoaderFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from '@remix-run/react';
import { requireUserId } from "~/utils/auth.server";
import { getOtherUsers } from '~/utils/user.server'
import { Layout } from "~/components/layout";
import { UserPanel } from "~/components/user-panel";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const users = await getOtherUsers(userId)
  return json({users});
};

export default function Logout() {
  const { users } = useLoaderData()
  return (
    <div className="h-screen bg-slate-700 flex justify-center items-center">
      <form action="/logout" method="post">
        <button
          type="submit"
          className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
        >
          Log out
        </button>
      </form>
      <Layout>
        <Outlet />
        <div className="h-full flex">
          <UserPanel users={users} />
        </div>
      </Layout>
    </div>
  );
}
