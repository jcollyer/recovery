import { LoaderFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { getOtherUsers } from "~/utils/user.server";
import { getFilteredMessages, getRecentMessages } from "~/utils/messages.server";
import { Layout } from "~/components/layout";
import { UserPanel } from "~/components/user-panel";
import { Message } from "~/components/message";
import { Message as IMessage, Profile, Prisma } from "@prisma/client";
import { SearchBar } from '~/components/search-bar'
import { RecentBar } from '~/components/recent-bar'

interface MessageWithProfile extends IMessage {
  author: {
    profile: Profile;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const users = await getOtherUsers(userId);
  const url = new URL(request.url);
  const sort = url.searchParams.get('sort');
  const filter = url.searchParams.get('filter');
  const recentMessages = await getRecentMessages();

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

  const messages = await getFilteredMessages(userId, sortOptions, textFilter);

  return json({ users, messages, recentMessages });
};

export default function Logout() {
  const { messages, users, recentMessages } = useLoaderData();
  return (
    <div className="h-screen bg-slate-700 flex justify-center items-center">
      <Layout>
        <Outlet />
        <div className="h-full flex">
          <UserPanel users={users} />
          <div className="flex-1 flex flex-col">
            <SearchBar />
            <div className="flex-1 flex">
              <div className="w-full p-10 flex flex-col gap-y-4">
                {messages.map((message: MessageWithProfile) => (
                  <Message
                    key={message.id}
                    profile={message.author.profile}
                    message={message}
                  />
                ))}
              </div>
              <RecentBar messages={recentMessages} />
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
