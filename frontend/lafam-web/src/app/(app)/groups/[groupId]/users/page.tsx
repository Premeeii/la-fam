'use client';

import { use, useState } from 'react';
import {
  useGroupMembers,
  useGroup,
  useKickMember,
  useTransferOwnership,
} from '@/lib/hooks/useGroup';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Ellipsis, UserMinus, User, Crown } from 'lucide-react';
import { ProfileCard } from '@/components/groups/ProfileCard';

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
  const {
    data: members,
    isLoading,
    error,
  } = useGroupMembers(resolvedParams.groupId);

  const { data: groups } = useGroup();
  const currentGroup = groups?.find(
    (g) => g.groupId === resolvedParams.groupId,
  );
  const isOwner = currentGroup?.role === 'OWNER';

  const { mutate: kickMember, isPending: isKicking } = useKickMember();
  const { mutate: transferOwner, isPending: isTransferring } =
    useTransferOwnership();

  const [activeProfileUserId, setActiveProfileUserId] = useState<string | null>(
    null,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="border-t border-gray-100"></div>
      {isLoading ? (
        <div className="text-gray-500 dark:text-gray-400">
          Loading members...
        </div>
      ) : error ? (
        <div className="text-red-500">Failed to load members</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members?.map((member) => {
            const isProfileOpen = activeProfileUserId === member.userId;

            return (
              <Popover
                key={member.userId}
                open={isProfileOpen}
                onOpenChange={(open) => {
                  if (!open) setActiveProfileUserId(null);
                }}
              >
                <Card className="dark:bg-background relative flex h-80 flex-col items-center justify-center rounded-md border-gray-200 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md dark:border-gray-700">
                  <div className="absolute top-4 right-4 flex items-center justify-center">
                    <PopoverTrigger
                      render={
                        <button
                          className="pointer-events-none absolute inset-0"
                          aria-hidden="true"
                        />
                      }
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                          >
                            <span className="sr-only">Open menu</span>
                            <Ellipsis className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            setActiveProfileUserId(member.userId || null)
                          }
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>View Profile</span>
                        </DropdownMenuItem>

                        {isOwner && member.role !== 'OWNER' && (
                          <DropdownMenuItem
                            className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800"
                            onClick={() =>
                              transferOwner({
                                groupId: resolvedParams.groupId,
                                userId: member.userId || 'undefined',
                              })
                            }
                            disabled={isTransferring}
                          >
                            <Crown className="mr-2 h-4 w-4" />
                            <span>Make Owner</span>
                          </DropdownMenuItem>
                        )}

                        {isOwner && member.role !== 'OWNER' && (
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-500 dark:focus:bg-red-950/50 dark:focus:text-red-400"
                            onClick={() =>
                              kickMember({
                                groupId: resolvedParams.groupId,
                                userId: member.userId || 'undefined',
                              })
                            }
                            disabled={isKicking}
                          >
                            <UserMinus className="mr-2 h-4 w-4" />
                            <span>Kick from group</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Avatar className="mb-4 h-24 w-24 border border-gray-100 shadow-sm dark:border-gray-700">
                    {member.userAvatarUrl && (
                      <AvatarImage
                        src={member.userAvatarUrl}
                        alt={member.displayName || 'User'}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-blue-50 text-2xl font-bold text-blue-600">
                      {getInitials(member.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg leading-tight font-bold text-gray-900 dark:text-gray-100">
                    {member.displayName}
                  </h3>
                  <h4 className="mt-1 text-sm leading-tight font-medium text-gray-600 dark:text-gray-400">
                    {member.bio && member.bio.length > 20
                      ? `${member.bio.substring(0, 20)}...`
                      : member.bio}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-gray-400 capitalize dark:text-gray-500">
                    {member.role?.toLowerCase() || 'Member'}
                  </p>
                </Card>

                <PopoverContent
                  side="bottom"
                  align="start"
                  sideOffset={8}
                  className="w-auto border-none bg-transparent p-0 shadow-none"
                >
                  <ProfileCard
                    displayName={member.displayName}
                    userAvatarUrl={member.userAvatarUrl}
                    bio={member.bio}
                    role={member.role}
                  />
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      )}
    </div>
  );
}
