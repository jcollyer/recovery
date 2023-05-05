import { prisma } from "./prisma.server";
import { MessageStyle, Prisma } from "@prisma/client";

export const createMessage = async (
  message: string,
  userId: string,
  recipientId: string,
  style: MessageStyle
) => {
  await prisma.message.create({
    data: {
      message,
      style,
      author: {
        connect: {
          id: userId,
        },
      },
      recipient: {
        connect: {
          id: recipientId,
        },
      },
    },
  });
};

export const getFilteredMessages = async (
  userId: string,
  sortFilter: Prisma.MessageOrderByWithRelationInput,
  whereFilter: Prisma.MessageWhereInput
) => {
  return await prisma.message.findMany({
    select: {
      id: true,
      style: true,
      message: true,
      author: {
        select: {
          profile: true,
        },
      },
    },
    orderBy: {
      ...sortFilter,
    },
    where: {
      recipientId: userId,
      ...whereFilter,
    },
  });
};

export const getRecentMessages = async () => {
    return prisma.message.findMany({
        take: 3,
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            style: {
              select: {
                emoji: true,
              },
            },
            recipient: {
              select: {
                id: true,
                profile: true,
              },
            },
        },
    })
}
