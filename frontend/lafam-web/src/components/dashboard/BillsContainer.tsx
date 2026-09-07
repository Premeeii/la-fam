'use client';

import { useMemo } from 'react';
import { useGroupBills } from '@/lib/hooks/useBills';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function BillsContainer({ groupId }: { groupId: string }) {
  const { data: bills, isLoading: isBillsLoading } = useGroupBills(groupId);

  // sort bills latest first
  const latestBills = useMemo(() => {
    if (!bills) return [];
    return [...bills]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // sort by latest first
      })
      .slice(0, 2);
  }, [bills]);

  const formatAmount = (amount?: number) => {
    if (amount == null) return '0';
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="flex w-full flex-col rounded-[20px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-background p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold text-gray-800 dark:text-gray-200">Bills</h2>

      <div className="flex flex-1 flex-col gap-3">
        {isBillsLoading ? (
          // Skeleton for loading state
          <>
            <div className="h-24 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700"></div>
            <div className="h-24 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700"></div>
          </>
        ) : latestBills.length === 0 ? (
          // show message when no bills
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-gray-50 dark:bg-gray-800 p-6 text-gray-400 dark:text-gray-500">
            <p className="text-sm">No bills added yet.</p>
          </div>
        ) : (
          // render bills data in small cards
          latestBills.map((bill) => (
            <div
              key={bill.id}
              className="flex flex-col rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-4"
            >
              <span className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                {bill.categoryName}
              </span>
              <span className="mb-3 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                {bill.title}
              </span>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatAmount(bill.amount)} THB
              </span>
            </div>
          ))
        )}
      </div>

      {/* go to bills page */}
      <div className="mt-5">
        <Link href={`/groups/${groupId}/bills`} className="w-full">
          <Button
            variant="outline"
            className="h-10 w-full rounded-lg border-gray-200 dark:border-gray-700 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            View All Bills
          </Button>
        </Link>
      </div>
    </div>
  );
}
