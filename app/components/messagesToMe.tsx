import { Message as IMessage, Profile } from "@prisma/client";
import { Message } from "~/components/message";
import { SearchBar } from "~/components/search-bar";
import { Modal } from "./modal";

interface MessageWithProfile extends IMessage {
  author: {
    profile: Profile;
  };
}

interface UserWithProfile {
  profile: Profile
}

export function MessagesToMe({ messages, user }: { messages: MessageWithProfile[], user: UserWithProfile }) {

  return (
    <Modal isOpen={true} className="w-full p-10 flex flex-col gap-y-4">
      <SearchBar profile={user.profile} />
      {messages.map((message: MessageWithProfile) => (
        <Message
          key={message.id}
          profile={message.author.profile}
          message={message}
        />
      ))}
    </Modal>
  );
}
