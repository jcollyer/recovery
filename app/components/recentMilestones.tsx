import type { User, Milestone } from '@prisma/client'
import { UserCircle } from './user-circle'
import { emojiMap } from '~/utils/constants'

interface MilestoneWithRecipient extends Milestone {
  owner: User
}

export function RecentMilestones({ milestones }: { milestones: MilestoneWithRecipient[] }) {
  return (
    <div className="w-1/5 border-l-4 border-l-yellow-300 flex flex-col items-center">
      <h2 className="text-xl text-yellow-300 font-semibold my-6">Recent Milestones</h2>
      <div className="h-full flex flex-col gap-y-10 mt-10">
        {milestones.map(milestone => (
          <div className="h-24 w-24 relative" key={milestone.owner.id}>
            <h2 className="text-xl font-semibold">{milestone.title}</h2>
            <p>{milestone.description}</p>
            <UserCircle profile={milestone.owner.profile} className="w-20 h-20" />
          </div>
        ))}
      </div>
    </div>
  )
}