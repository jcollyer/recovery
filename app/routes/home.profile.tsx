// app/routes/home/profile.tsx

import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { Modal } from "~/components/modal";
import { FormField } from "~/components/form-field";
import { getUser, requireUserId } from "~/utils/auth.server";
import { validateName } from "~/utils/validators.server";
import { roles } from "~/utils/constants";
import { SelectBox } from "~/components/select-box";
// import { ImageUploader } from "~/components/image-uploader";
import { updateUser } from "~/utils/user.server";
import type { Role } from "@prisma/client";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return json({ user });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const userId = await requireUserId(request);
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");
  let role = form.get("role");

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof role !== "string"
  ) {
    return json({ error: `Invalid Form Data` }, { status: 400 });
  }

  const errors = {
    firstName: validateName(firstName),
    lastName: validateName(lastName),
    role: validateName(role),
  };

  if (Object.values(errors).some(Boolean))
    return json(
      { errors, fields: { role, firstName, lastName } },
      { status: 400 }
    );

  await updateUser(userId, { firstName, lastName, role: role as Role });

  return redirect("/home");
};

export default function ProfileSettings() {
  const { user } = useLoaderData();

  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName,
    lastName: user?.profile?.lastName,
    role: user?.profile?.role || "SUPPORTER",
    profilePicture: user?.profile?.profilePicture || "",
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <Modal isOpen={true} className="w-1/3">
      <div className="p-3">
        <h2 className="text-4xl font-semibold text-blue-600 text-center mb-4">
          Your Profile
        </h2>
        <div className="flex">
          <div className="w-1/3">
          </div>
          <div className="flex-1">
            <form method="POST">
              <FormField
                htmlFor="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
              />
              <FormField
                htmlFor="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
              />
              <SelectBox
                className="w-full rounded-xl px-3 py-2 text-gray-400"
                id="role"
                label="Role"
                name="role"
                options={roles}
                value={formData.role}
                onChange={(e) => handleInputChange(e, "role")}
              />
              <div className="w-full text-right mt-4">
                <button className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-16 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
