import { useState } from "react";
import { FaBars, FaCaretRight } from "react-icons/fa";
import { LoaderFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { getUser, requireUserId } from "~/utils/auth.server";
import { getOtherUsers } from "~/utils/user.server";
import { getRecentMilestones } from "~/utils/milestone.server";
import { Layout } from "~/components/layout";
import { UserPanel } from "~/components/user-panel";
import { SearchBar } from "~/components/search-bar";
import { RecentMilestones } from "~/components/recentMilestones";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);
  const users = await getOtherUsers(userId);
  const recentMilestones = await getRecentMilestones();

  return json({ users, recentMilestones, user });
};

export default function Logout() {
  const { users, recentMilestones, user } = useLoaderData();
  const navigate = useNavigate();

  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const toggleNavDrawer = () =>
    navDrawerOpen ? setNavDrawerOpen(false) : setNavDrawerOpen(true);

  return (
    <div className="h-screen bg-slate-700 flex justify-center items-center">
      <Layout>
        <Outlet />
        <div className="h-full flex">
          <UserPanel users={users} />
          <div className="flex-1 flex flex-col">
            <div>
              <FaBars color="white" onClick={toggleNavDrawer} />
            </div>

            <nav
              className={
                navDrawerOpen ? "block w-1/6 bg-white absolute top-5" : "hidden"
              }
            >
              <ul>
                <li className="flex">
                  <button onClick={() => navigate("myMessages")}>
                    My Messages
                  </button>
                  <FaCaretRight />
                </li>
                <li className="flex">
                  <button onClick={() => navigate("messages")}>
                    All Messages
                  </button>
                  <FaCaretRight />
                </li>
                <li className="flex">
                  <span>All Milestones</span>
                  <FaCaretRight />
                </li>
              </ul>
            </nav>

            <SearchBar profile={user.profile} />
            <div className="flex-1 flex">
              <RecentMilestones milestones={recentMilestones} />
              <button
                onClick={() => navigate(`create/milestone`)}
                className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2"
              >
                Create Milestone
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
