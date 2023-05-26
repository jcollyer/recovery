import { useState } from "react";
import { FaBars, FaCaretRight } from "react-icons/fa";
import { LoaderFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { UserCircle } from "../components/user-circle";
import { getUser } from "~/utils/auth.server";
import { Layout } from "~/components/layout";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return json({ user });
};

export default function Logout() {
  const { user } = useLoaderData();
  const navigate = useNavigate();

  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const toggleNavDrawer = () =>
    navDrawerOpen ? setNavDrawerOpen(false) : setNavDrawerOpen(true);

  return (
    <Layout>
      <Outlet />
      <header className="flex bg-gray-300 px-5 py-2">
        <div className="flex-1 mt-4 relative">
          <FaBars size="30" color="white" onClick={toggleNavDrawer} />
          <nav
            className={
              navDrawerOpen ? "block w-1/4 bg-white absolute top-10 p-3" : "hidden"
            }
          >
            <ul>
              <li className="flex p-1">
                <button onClick={() => navigate("myMessages")}>
                  My Messages
                </button>
                <FaCaretRight />
              </li>
              <li className="flex p-1">
                <button onClick={() => navigate("messages")}>
                  All Messages
                </button>
                <FaCaretRight />
              </li>
              <li className="flex p-1">
                <button onClick={() => navigate("/milestones")}>
                  All Milestones
                </button>
                <FaCaretRight />
              </li>
              <li className="flex p-1">
                <button onClick={() => navigate("messageUsers")}>
                  Message Users
                </button>
                <FaCaretRight />
              </li>
            </ul>
          </nav>
        </div>

        <div className="w-1/4 flex justify-end">
          <UserCircle
            className="h-14 w-14 transition duration-300 ease-in-out hover:scale-110 hover:border-2 hover:border-yellow-300"
            profile={user.profile}
            onClick={() => navigate("profile")}
          />
          <div className="pt-2 pl-3">

          
          <form action="/logout" method="POST">
            <button
              type="submit"
              className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
            >
              Sign Out
            </button>
          </form>
          </div>
        </div>
      </header>

      <div>
        <button
          onClick={() => navigate(`create/milestone`)}
          className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2"
        >
          Create Milestone
        </button>
      </div>
    </Layout>
  );
}
