import { LoaderFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { getOtherUsers } from "~/utils/user.server";
import { Layout } from "~/components/layout";
import { UserPanel } from "~/components/user-panel";
import { getFilteredMessages } from "~/utils/messages.server";
import { Message } from "~/components/message";
import { Message as IMessage, Profile } from "@prisma/client";

interface MessageWithProfile extends IMessage {
  author: {
    profile: Profile;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const users = await getOtherUsers(userId);
  const messages = await getFilteredMessages(userId, {}, {});

  return json({ users, messages });
};

export default function Logout() {
  const { messages, users } = useLoaderData();
  return (
    <div className="h-screen bg-slate-700 flex justify-center items-center">
      <Layout>
        <Outlet />
        <div className="h-full flex">
          <UserPanel users={users} />
          <div className="flex-1 flex flex-col">
            {/* Search Bar Goes Here */}
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
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
