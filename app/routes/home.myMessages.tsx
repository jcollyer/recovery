import { requireUserId } from "~/utils/auth.server";
import { LoaderFunction, json } from "@remix-run/node";
import type { Prisma } from "@prisma/client";
import { getFilteredMessages } from "~/utils/messages.server";
import { getUser } from "~/utils/auth.server";
import { useLoaderData } from "@remix-run/react";
import { MessagesToMe } from "~/components/messagesToMe";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort");
  const filter = url.searchParams.get("filter");
  const userId = await requireUserId(request);
  const user = await getUser(request);

  let sortOptions: Prisma.MessageOrderByWithRelationInput = {};
  if (sort) {
    if (sort === "date") {
      sortOptions = { createdAt: "desc" };
    }
    if (sort === "sender") {
      sortOptions = { author: { profile: { firstName: "asc" } } };
    }
    if (sort === "emoji") {
      sortOptions = { style: { emoji: "asc" } };
    }
  }

  let textFilter: Prisma.MessageWhereInput = {};
  if (filter) {
    textFilter = {
      OR: [
        { message: { mode: "insensitive", contains: filter } },
        {
          author: {
            OR: [
              {
                profile: {
                  is: { firstName: { mode: "insensitive", contains: filter } },
                },
              },
              {
                profile: {
                  is: { lastName: { mode: "insensitive", contains: filter } },
                },
              },
            ],
          },
        },
      ],
    };
  }

  const messagesToMe = await getFilteredMessages(
    userId,
    sortOptions,
    textFilter
  );

  return json({ messagesToMe, user });
};

export default function MessagesToMeRoute() {
  const { messagesToMe, user } = useLoaderData();
  return <MessagesToMe messages={messagesToMe} user={user} />;
}
