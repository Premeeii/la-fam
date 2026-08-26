'use client';

import { use } from 'react';
import { useGroupMembers } from '@/lib/hooks/useGroup';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

function getInitials(name?: string) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function UsersPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const resolvedParams = use(params);
  const { data: members, isLoading, error } = useGroupMembers(resolvedParams.groupId);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Group Member
      </h1>

      {isLoading ? (
        <div className="text-gray-500">Loading members...</div>
      ) : error ? (
        <div className="text-red-500">Failed to load members</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members?.map((member) => (
            <Card
              key={member.userId}
              className="flex flex-col items-center justify-center p-8 h-80 text-center rounded-xl border-gray-200 shadow-sm transition-shadow hover:shadow-md bg-white"
            >
              <Avatar className="h-24 w-24 mb-4 shadow-sm border border-gray-100">
                {member.userAvatarUrl && (
                  <AvatarImage src={member.userAvatarUrl} alt={member.displayName || 'User'} className="object-cover" />
                )}
                <AvatarFallback className="text-2xl font-bold bg-blue-50 text-blue-600">
                  {getInitials(member.displayName)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {member.displayName}
              </h3>
              <p className="text-sm font-medium text-gray-400 mt-1 capitalize">
                {member.role?.toLowerCase() || 'Member'}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}