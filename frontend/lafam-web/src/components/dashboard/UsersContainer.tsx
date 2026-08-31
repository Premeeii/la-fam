'use client'

import { useGroupMembers } from "@/lib/hooks/useGroup"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface UsersContainerProps {
  groupId: string
}

export function UsersContainer({ groupId }: UsersContainerProps) {
  const { data: members, isLoading } = useGroupMembers(groupId);


  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 mt-6">
        <div className="h-12 w-full animate-pulse"></div>
        <div className="h-12 w-full animate-pulse"></div>
        <div className="h-12 w-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col mt-6 rounded-[20px] border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold text-gray-800">Members</h2>
      <div className="flex flex-col gap-4">
        {members?.map((member) => (
          <div
            key={member.userId}
            className="flex items-center gap-4 p-3"
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.userAvatarUrl || ''} />
            <AvatarFallback className="bg-gray-200 text-gray-600">
              {member.displayName?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="font-medium text-gray-900">{member.displayName}</h3>
            <p className="text-sm text-gray-500">{member.displayName}</p>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}