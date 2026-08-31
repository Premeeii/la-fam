'use client';

import { useMemo } from 'react';
import { useGroupBills } from '@/lib/hooks/useBills';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function BillsContainer({ groupId }: { groupId: string }) {
  const { data: bills, isLoading: isBillsLoading } = useGroupBills(groupId);

  // เรียงลำดับบิลล่าสุดขึ้นก่อน (อิงจากวันที่สร้าง) และตัดมาแค่ 2 บิล
  const latestBills = useMemo(() => {
    if (!bills) return [];
    return [...bills]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // เรียงจากใหม่ไปเก่า
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
    <div className="flex w-full flex-col rounded-[20px] border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold text-gray-800">Bills</h2>

      <div className="flex flex-1 flex-col gap-3">
        {isBillsLoading ? (
          // Skeleton สำหรับตอนกำลังโหลด
          <>
            <div className="h-24 w-full animate-pulse rounded-xl bg-gray-100"></div>
            <div className="h-24 w-full animate-pulse rounded-xl bg-gray-100"></div>
          </>
        ) : latestBills.length === 0 ? (
          // แสดงข้อความเมื่อไม่มีบิล
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-gray-50 p-6 text-gray-400">
            <p className="text-sm">No bills added yet.</p>
          </div>
        ) : (
          // นำข้อมูลมาเรนเดอร์เป็นการ์ดใบเล็ก fetch bills with category name
          latestBills.map((bill) => (
            <div
              key={bill.id}
              className="flex flex-col rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <span className="mb-1 text-xs font-medium text-gray-500">
                {bill.categoryName}
              </span>
              <span className="mb-3 truncate text-sm font-semibold text-gray-900">
                {bill.title}
              </span>
              <span className="text-xl font-bold text-gray-900">
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
            className="h-10 w-full rounded-lg border-gray-200 font-medium text-gray-700 hover:bg-gray-50"
          >
            View All Bills
          </Button>
        </Link>
      </div>
    </div>
  );
}
