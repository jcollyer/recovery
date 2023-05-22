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
