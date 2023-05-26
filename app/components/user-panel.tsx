import { User } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import { UserCircle } from "~/components/user-circle";
import {Modal} from './modal';

export function UserPanel({ users }: { users: User[] }) {
  const navigate = useNavigate();
  return (
    <Modal isOpen={true} className="w-1/6 bg-gray-200 flex flex-col">
      <div className="text-center bg-gray-300 h-20 flex items-center justify-center">
        <h2 className="text-xl text-blue-600 font-semibold">My Team</h2>
      </div>
      <div className="flex-1 overflow-y-scroll py-4 flex flex-col gap-y-10">
        {users.map((user) => (
          <UserCircle
            key={user.id}
            profile={user.profile}
            className="h-24 w-24 mx-auto flex-shrink-0"
            onClick={() => navigate(`/home/message/${user.id}`)}
          />
        ))}
      </div>
    </Modal>
  );
}
