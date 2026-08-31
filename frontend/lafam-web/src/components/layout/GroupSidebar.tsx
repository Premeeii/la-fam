'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Settings,
  ChevronRight,
  Users,
  Calendar,
  Receipt,
  FileText,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGroup } from '@/lib/hooks/useGroup';
import { useCurrentGroup } from '@/lib/stores/currentGroup';
import { AvatarImage } from '@/components/ui/avatar';

export function GroupSidebar() {
  const pathname = usePathname();
  const { data: groups, isLoading } = useGroup();
  const currentGroupId = useCurrentGroup((s) => s.groupId);

  const groupNavItems = [
    {
      name: 'Dashboard',
      href: currentGroupId ? `/groups/${currentGroupId}/dashboard` : '#',
      icon: LayoutGrid,
    },
    {
      name: 'Users',
      href: currentGroupId ? `/groups/${currentGroupId}/users` : '#',
      icon: Users,
    },
    {
      name: 'Calendar',
      href: currentGroupId ? `/groups/${currentGroupId}/calendar` : '#',
      icon: Calendar,
    },
    {
      name: 'Bills',
      href: currentGroupId ? `/groups/${currentGroupId}/bills` : '#',
      icon: Receipt,
    },
    /*{
      name: 'Notes',
      href: currentGroupId ? `/groups/${currentGroupId}/notes` : '#',
      icon: FileText,
    },*/
    {
      name: 'Setting',
      href: currentGroupId ? `/groups/${currentGroupId}/settings` : '#',
      icon: Settings,
    },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'G';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getBgColorClass = (index: number) => {
    const colors = [
      'bg-green-100 text-green-700',
      'bg-orange-100 text-orange-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700',
      'bg-yellow-100 text-yellow-700',
      'bg-blue-100 text-blue-700',
    ];
    return colors[index % colors.length];
  };

  return (
    <aside className="hidden shrink-0 border-r border-gray-100 bg-white lg:flex">
      {/* 1st Column: Group Switcher */}
      <div className="flex w-22 flex-col items-center gap-4 border-r border-gray-100 bg-gray-50/30 py-4">
        <div className="my-1 h-px w-8 rounded-full bg-gray-200"></div>
        {!isLoading &&
          groups?.map((group, index) => {
            const isActive = currentGroupId === group.groupId;
            return (
              <div
                key={group.groupId}
                className="group relative flex w-full items-center justify-center"
              >
                <Link href={`/groups/${group.groupId}`} className="relative">
                  <div
                    className={cn(
                      'h-11 w-11 cursor-pointer rounded-xl transition-all',
                      isActive
                        ? 'scale-105 ring-2 ring-blue-500 ring-offset-2'
                        : 'border border-gray-200 hover:border-gray-300 hover:shadow-sm',
                    )}
                  >
                    {!group.groupAvatarUrl && (
                      <div
                        className={cn(
                          'flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold transition-all',
                          isActive
                            ? 'scale-105 bg-white text-blue-600 shadow-sm ring-2 ring-blue-500 ring-offset-2'
                            : `${getBgColorClass(index)} text-gray-700`,
                        )}
                      >
                        {getInitials(group.groupName)}
                      </div>
                    )}
                    {group.groupAvatarUrl && (
                      <AvatarImage
                        src={group.groupAvatarUrl}
                        alt={group.groupName || 'Group'}
                        className="rounded-xl object-cover"
                      />
                    )}
                  </div>
                </Link>
                {isActive && (
                  <div className="absolute top-1/2 right-1 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-blue-600" />
                )}
              </div>
            );
          })}
      </div>

      {/* 2nd Column: Group Navigation */}
      <div className="flex w-60 flex-col gap-1 px-3 py-4">
        {currentGroupId ? (
          groupNavItems.map((item) => {
            const isActive =
              pathname.startsWith(item.href) && item.href !== '#';
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      'h-4 w-4',
                      isActive ? 'text-white' : 'text-gray-400',
                    )}
                  />
                  {item.name}
                </div>
                <ChevronRight
                  className={cn(
                    'h-4 w-4',
                    isActive ? 'text-white' : 'text-gray-300',
                  )}
                />
              </Link>
            );
          })
        ) : (
          <div className="mt-6 rounded-xl p-4 text-center text-sm text-gray-400">
            Please select a group
          </div>
        )}
      </div>
    </aside>
  );
}
