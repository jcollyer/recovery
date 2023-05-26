import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  getFilteredMessages,
  getRecentMessages,
} from "~/utils/messages.server";
import { RecentMessages } from "~/components/recentMessages";

export const loader: LoaderFunction = async ({request}) => {
  const recentMessages = await getRecentMessages();
  return json({recentMessages})
} 

export default function Messages() {
  const {recentMessages} = useLoaderData();
  return <RecentMessages messages={recentMessages} />
}