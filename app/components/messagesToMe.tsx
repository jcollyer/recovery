import { Message as IMessage, Profile, Prisma } from "@prisma/client";
import { Message } from "~/components/message";
interface MessageWithProfile extends IMessage {
  author: {
    profile: Profile;
  };
}

export function MessagesToMe({messages}: {messages:MessageWithProfile[]}){
  return (
    <div className="w-full p-10 flex flex-col gap-y-4">
      {messages.map((message: MessageWithProfile) => (
        <Message
          key={message.id}
          profile={message.author.profile}
          message={message}
        />
      ))}
    </div>
  );
};