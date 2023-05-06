import type { ActionFunction } from "@remix-run/node";
import { redirect, unstable_parseMultipartFormData } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { s3UploaderHandler } from "~/utils/uploader.server";
import { prisma } from "~/utils/prisma.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  if (!userId) {
    return redirect("/");
  }

  const formData = await unstable_parseMultipartFormData(request, s3UploaderHandler);
  const file = formData.get("profile-pic")?.toString() || ""

    await prisma.user.update({
    data: {
      profile: {
        update: {
          profilePicture: file,
        },
      },
    },
    where: {
      id: userId,
    },
  });
  

  return {
    filename: file,
  }
}