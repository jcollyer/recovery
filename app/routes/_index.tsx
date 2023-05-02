import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { LoaderFunction, redirect } from "@remix-run/node";
import { getUser } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect("/home") : null;
};

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  return (
    <div className="h-screen bg-slate-700 flex justify-center items-center">
      <Link
        to={"/login"}
        className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
      >
        Log in
      </Link>
      <h2 className="text-blue-600 font-extrabold text-5xl">Splash page</h2>
    </div>
  );
}
