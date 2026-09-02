import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useEffect, useRef, useState } from 'react';
import { useGroup } from '@/lib/hooks/useGroup';
import { useRouter } from 'next/navigation';

export function SearchGroupBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: groups } = useGroup();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filteredGroups =
    groups?.filter((group) =>
      group.groupName?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsDropdownOpen(value.length > 0);
  };

  const handleSelectGroup = (groupId: string) => {
    router.push(`/groups/${groupId}/dashboard`);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  return (
    <div className="hidden flex-1 items-center justify-center px-6 md:flex">
      <div className="relative w-full max-w-lg" ref={dropdownRef}>
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search Group..."
          className="h-10 w-full rounded-lg border-gray-200 bg-white pr-4 pl-10 text-sm shadow-sm placeholder:text-gray-400 focus-visible:ring-blue-100"
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => {
            if (searchQuery.length > 0) setIsDropdownOpen(true);
          }}
        />
        {isDropdownOpen && filteredGroups.length > 0 && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="max-h-60 overflow-y-auto">
              {filteredGroups.map((group) => (
                <button
                  key={group.groupId}
                  onClick={() => handleSelectGroup(group.groupId || '')}
                  className="w-full cursor-pointer px-8 py-5 text-left text-sm font-semibold transition-colors hover:bg-gray-50"
                >
                  {group.groupName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
