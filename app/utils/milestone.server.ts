import { prisma } from "./prisma.server";

export const createMilestone = async (
  title: string,
  description: string,
  userId: string,
  ownerId: string
) => {
  await prisma.milestone.create({
    data: {
      title,
      description,
      author: {
        connect: {
          id: ownerId,
        },
      },
      owner: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

export const getMilestoneById = async (milestoneId: string) => {
  return await prisma.milestone.findUnique({
    where: {
      id: milestoneId,
    },
  });
};

export const getRecentMilestones = async () => {
  return await prisma.milestone.findMany({
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      title: true,
      description: true,
      owner: {
        select: {
          id: true,
          profile: true,
        },
      },
      author: {
        select: {
          id: true,
          profile: true,
        },
      },
    },
  });
};