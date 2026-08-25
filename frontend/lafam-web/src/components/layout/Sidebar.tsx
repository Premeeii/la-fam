'use client';
import { usePathname } from 'next/navigation';
import { GlobalSidebar } from './GlobalSidebar';
import { GroupSidebar } from './GroupSidebar';

export function Sidebar() {
  const pathname = usePathname();

  // If the pathname starts with /groups/ and has something after it (a groupId),
  // but is NOT /groups/join, we show the GroupSidebar.
  const isGroupSpecific = pathname.match(/^\/groups\/([^\/]+)(\/|$)/);
  const isJoinPage = pathname === '/groups/join';

  if (isGroupSpecific && !isJoinPage) {
    return <GroupSidebar />;
  }

  return <GlobalSidebar />;
}
