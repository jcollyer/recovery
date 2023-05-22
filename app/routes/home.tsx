import { LoaderFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getUser, requireUserId } from "~/utils/auth.server";
import { getOtherUsers } from "~/utils/user.server";
import { getFilteredMessages, getRecentMessages } from "~/utils/messages.server";
import { getRecentMilestones } from "~/utils/milestone.server";
import { Layout } from "~/components/layout";
import { UserPanel } from "~/components/user-panel";
import { MessagesToMe } from "~/components/messagesToMe";
import type { Prisma } from "@prisma/client";
import { SearchBar } from '~/components/search-bar';
import { RecentMessages } from '~/components/recentMessages';
import { RecentMilestones } from '~/components/recentMilestones';


export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);
  const users = await getOtherUsers(userId);
  const url = new URL(request.url);
  const sort = url.searchParams.get('sort');
  const filter = url.searchParams.get('filter');
  const recentMessages = await getRecentMessages();
  const recentMilestones = await getRecentMilestones();
  let sortOptions: Prisma.MessageOrderByWithRelationInput = {}
  if (sort) {
    if (sort === 'date') {
      sortOptions = { createdAt: 'desc' }
    }
    if (sort === 'sender') {
      sortOptions = { author: { profile: { firstName: 'asc' } } }
    }
    if (sort === 'emoji') {
      sortOptions = { style: { emoji: 'asc' } }
    }
  }

  let textFilter: Prisma.MessageWhereInput = {};
  if (filter) {
    textFilter = {
      OR: [
        { message: { mode: 'insensitive', contains: filter } },
        {
          author: {
            OR: [
              { profile: { is: { firstName: { mode: 'insensitive', contains: filter } } } },
              { profile: { is: { lastName: { mode: 'insensitive', contains: filter } } } },
            ],
          },
        },
      ],
    }
  }

  const messagesToMe = await getFilteredMessages(userId, sortOptions, textFilter);

  return json({ users, messagesToMe, recentMessages, recentMilestones, user });
};

export default function Logout() {
  const { messagesToMe, users, recentMessages, recentMilestones, user } = useLoaderData();
  return (
    <div className="h-screen bg-slate-700 flex justify-center items-center">
      <Layout>
        <Outlet />
        <div className="h-full flex">
          <UserPanel users={users} />
          <div className="flex-1 flex flex-col">
            <SearchBar profile={user.profile} />
            <div className="flex-1 flex">
              <RecentMilestones milestones={recentMilestones} />
              <MessagesToMe messages={messagesToMe} />
              <RecentMessages messages={recentMessages} />
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
