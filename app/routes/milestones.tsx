import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getRecentMilestones } from "~/utils/milestone.server";
import { RecentMilestones } from "~/components/recentMilestones";
import { Layout } from "~/components/layout";

export const loader: LoaderFunction = async () => {
    const recentMilestones = await getRecentMilestones();
    return json({recentMilestones})
}

export default function Milestones() {
    const {recentMilestones} = useLoaderData();
    return (
        <Layout>
            <RecentMilestones milestones={recentMilestones} />
        </Layout>
    )
}