import { UserCircle } from '~/components/user-circle'
import { Profile, Message as IMessage } from '@prisma/client'
import { colorMap, backgroundColorMap, emojiMap } from '~/utils/constants'

export function Message({ profile, message }: { profile: Profile; message: Partial<IMessage> }) {
  return (
    <div
      className={`flex ${
        backgroundColorMap[message.style?.backgroundColor || 'RED']
      } p-4 rounded-xl w-full gap-x-2 relative`}
    >
      <div>
        <UserCircle profile={profile} className="h-16 w-16" />
      </div>
      <div className="flex flex-col">
        <p className={`${colorMap[message.style?.textColor || 'WHITE']} font-bold text-lg whitespace-pre-wrap break-all`}>
          {profile.firstName} {profile.lastName}
        </p>
        <p className={`${colorMap[message.style?.textColor || 'WHITE']} whitespace-pre-wrap break-all`}>{message.message}</p>
      </div>
      <div className="absolute bottom-4 right-4 bg-white rounded-full h-10 w-10 flex items-center justify-center text-2xl">
        {emojiMap[message.style?.emoji || 'THUMBSUP']}
      </div>
    </div>
  )
}