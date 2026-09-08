'use client'

import type { BillResponse } from '@/lib/api/bills';
import { useGroupMembers } from '@/lib/hooks/useGroup';

interface BillCardProps {
  bill: BillResponse;
  groupId: string;
  canEdit: boolean;
  onEdit: (bill: BillResponse) => void;
}

export function BillCard({ bill, groupId, canEdit, onEdit }: BillCardProps) {
  const { data: members } = useGroupMembers(groupId);
  const creator = members?.find((m) => m.userId === bill.createdBy);

  const formatAmount = (amount?: number) => {
    if (amount == null) return '0';
    return amount.toLocaleString();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex items-stretch bg-white dark:bg-background border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
      {/* Left section */}
      <div className="flex-1 p-5 flex flex-col gap-1 border-r border-gray-100 dark:border-gray-700">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{bill.categoryName}</span>
        <p className="text-sm text-gray-500 dark:text-gray-400">{bill.title}</p>
        <span className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">{formatAmount(bill.amount)} THB</span>
      </div>

      {/* Right section — fixed width */}
      <div className="w-80 p-5 flex flex-col justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Date: </span>
            {formatDate(bill.billMonth)}
          </div>
          {canEdit && (
            <button
              onClick={() => onEdit(bill)}
              className="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
            >
              Edit
            </button>
          )}
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">Create by: </span>
          {bill.creatorName || 'Unknown'}
        </div>
      </div>
    </div>
  );
}
