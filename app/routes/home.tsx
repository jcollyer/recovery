import { LoaderFunction } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

export default function Logout() {
  return (
    <div className="h-screen bg-slate-700 flex justify-center items-center">
      <form action="/logout" method="post">
        <button
          type="submit"
          className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
        >
          Log out
        </button>
      </form>
      <h2 className="text-blue-600 font-extrabold text-5xl">
        logged in homepage
      </h2>
    </div>
  );
}
