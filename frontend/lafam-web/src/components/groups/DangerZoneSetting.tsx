'use client';

import { Button } from '../ui/button';
import { TriangleAlert } from 'lucide-react';

interface DangerZoneSettingProps {
  onDelete: () => void;
}

export function DangerZoneSetting({ onDelete }: DangerZoneSettingProps) {
  return (
    <>
      <div className="my-6 border-t" />
      <div className="flex flex-col gap-2 rounded-xl border border-red-100 bg-red-50 p-4">
        <div className="flex items-center gap-2">
          <TriangleAlert className="text-red-600" size={24} />
          <h2 className="mb-3 text-xl font-bold text-red-600">Danger Zone</h2>
        </div>
        <h3 className="text-md font-medium text-gray-900">Delete this group</h3>
        <p className="text-sm text-gray-500">
          Once you delete a group, there is no way to recover it.
        </p>
        <div className="flex justify-end">
          <Button
            variant="destructive"
            className="mt-3 flex w-fit rounded-lg bg-red-600 px-6 py-4.5 font-semibold text-white transition-colors hover:bg-red-700"
            onClick={onDelete}
          >
            Delete Group
          </Button>
        </div>
      </div>
    </>
  );
}
