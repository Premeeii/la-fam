import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGroup } from '@/lib/hooks/useGroup';
import { useCurrentGroup } from '@/lib/stores/currentGroup';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function GroupNav() {
  const SNAP_POINTS = ['28rem', 1];
  const pathname = usePathname();

  const { data: groups, isLoading } = useGroup();
  const currentGroupId = useCurrentGroup((s) => s.groupId);

  const groupNavItems = [
    {
      name: 'Dashboard',
      href: currentGroupId ? `/groups/${currentGroupId}/dashboard` : '#',
    },
    {
      name: 'Users',
      href: currentGroupId ? `/groups/${currentGroupId}/users` : '#',
    },
    {
      name: 'Calendar',
      href: currentGroupId ? `/groups/${currentGroupId}/calendar` : '#',
    },
    {
      name: 'Bills',
      href: currentGroupId ? `/groups/${currentGroupId}/bills` : '#',
    },
    /*{
      name: 'Notes',
      href: currentGroupId ? `/groups/${currentGroupId}/notes` : '#',
    
    },*/
    {
      name: 'Setting',
      href: currentGroupId ? `/groups/${currentGroupId}/settings` : '#',
    },
  ];

  return (
    <Drawer snapPoints={SNAP_POINTS} showSwipeHandle>
      <DrawerTrigger
        render={
          <button className="text-gray-400 transition-colors hover:text-gray-600 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        }
      />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Group Menu</DrawerTitle>
        </DrawerHeader>
        <div className="flex w-full flex-col gap-1 px-3 py-4">
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
                  <div className="flex items-center gap-3">{item.name}</div>
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

        <DrawerFooter>
          <DrawerClose render={<Button>Close</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
