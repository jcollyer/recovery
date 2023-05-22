import { useState } from "react";
import {
    ActionFunction,
    json,
    LoaderFunction,
    redirect,
  } from "@remix-run/node";
import { useLoaderData, useActionData } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { getUser } from "~/utils/auth.server";
import { createMilestone } from "~/utils/milestone.server";
import { Modal } from "~/components/modal";


export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request);
  return json({ user });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const form = await request.formData();
  const title = form.get("title");
  const description = form.get("description");
  const ownerId = form.get('userId');

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof ownerId !== "string"
  ) {
    return json({ error: `Invalid Form Data` }, { status: 400 });
  }
  if (!title.length) {
    return json({ error: `Please provide a message.` }, { status: 400 });
  }
  if (!description.length) {
    return json({ error: `No description found...` }, { status: 400 });
  }
  if (!ownerId.length) {
    return json({ error: `No owner found...` }, { status: 400 })
  }

  await createMilestone(title, description, ownerId, ownerId);

  return redirect('/home');
};

export default function MilestoneModal() {
  const actionData = useActionData();
  const [formError] = useState(actionData?.error || "");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setFormData((data) => ({ ...data, [field]: e.target.value }));
  };

  const { user } = useLoaderData();
  return (
    <Modal isOpen={true} className="w-2/3 p-10">
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full mb-2">
        {formError}
      </div>
      <form method="POST">
        <input type="hidden" value={user.id} name="userId" />
        <div className="flex flex-col md:flex-row gap-y-2 md:gap-y-0">
          <div className="text-center flex flex-col items-center gap-y-2 pr-8">
            <p className="text-blue-300">
              {user.profile.firstName} {user.profile.lastName}
            </p>
            {user.profile.department && (
              <span className="px-2 py-1 bg-gray-300 rounded-xl text-blue-300 w-auto">
                {user.profile.department[0].toUpperCase() +
                  user.profile.department.toLowerCase().slice(1)}
              </span>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-y-4">
            <input
              name="title"
              className="w-full rounded-xl p-4"
              value={formData.title}
              onChange={(e) => handleChange(e, "title")}
              placeholder="Add Milestone Title"
            />
            <textarea
              name="description"
              className="w-full rounded-xl h-40 p-4"
              value={formData.description}
              onChange={(e) => handleChange(e, "description")}
              placeholder="Add Milestone Description"
            />
          </div>
        </div>
        <br />
        <p className="text-blue-600 font-semibold mb-2">Preview</p>
        <div className="flex flex-col items-center md:flex-row gap-x-24 gap-y-2 md:gap-y-0">
          <>
            <div>{formData.title}</div>
            <div>{formData.description}</div>
          </>
          <div className="flex-1" />
          <button
            type="submit"
            className="rounded-xl bg-yellow-300 font-semibold text-blue-600 w-80 h-12 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
          >
            Create Milestone
          </button>
        </div>
      </form>
    </Modal>
  );
}
