'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { generateInviteToken } from '@/lib/api/groups';
import { toast } from 'sonner';

export function InviteMemberPopover({ groupId }: { groupId: string }) {
  const [inviteLink, setInviteLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const res = await generateInviteToken(groupId);
      const link = `${window.location.origin}/join?token=${res.token}`;
      setInviteLink(link);
    } catch (error) {
      toast.error('Failed to generate invite token');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger render={<Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium p-4"><Users className="h-4 w-4" />Invite Member</Button>}/>
      <PopoverContent className="w-[340px] p-5 rounded-2xl shadow-xl border-gray-200" align="end" sideOffset={12}>
        <div className="flex flex-col text-left">
          <h3 className="text-sm font-medium text-gray-900 mb-1">Invite Link</h3>
          <p className="text-xs text-gray-900 mb-4">The link can be used only once per user</p>
          <div className="flex w-full items-center space-x-2">
            <Input 
              readOnly 
              value={inviteLink} 
              className="flex-1 h-9 text-xs"
            />
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 rounded-full font-medium"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? '...' : 'Create'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
