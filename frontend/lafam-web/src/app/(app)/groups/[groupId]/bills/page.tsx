'use client';

import { use, useState, useMemo } from 'react';
import { useGroupBills, useMyBills, useBillsByCategory, useBillCategories } from '@/lib/hooks/useBills';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import type { BillResponse } from '@/lib/api/bills';
import { BillsHeader } from '@/components/bills/BillsHeader';
import { BillCard } from '@/components/bills/BillCard';
import { BillDialog } from '@/components/bills/BillDialog';
import { Pagination } from '@/components/bills/Pagination';

const BILLS_PER_PAGE = 5;

export default function BillsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const resolvedParams = use(params);
  const groupId = resolvedParams.groupId;

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all'); // 'all' | 'own' | categoryId
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedBill, setSelectedBill] = useState<BillResponse | undefined>();

  // Data fetching
  const { data: currentUser } = useCurrentUser();
  const { data: categories = [] } = useBillCategories();
  const { data: allBills = [], isLoading: isLoadingAll } = useGroupBills(groupId);
  const { data: myBills = [] } = useMyBills(groupId);

  // Determine which category is selected for the category query
  const selectedCategoryId = (activeFilter !== 'all' && activeFilter !== 'own') ? activeFilter : null;
  const { data: categoryBills = [] } = useBillsByCategory(groupId, selectedCategoryId);

  // Choose the right bill list based on filter
  const baseBills = useMemo(() => {
    if (activeFilter === 'own') return myBills;
    if (activeFilter !== 'all') return categoryBills;
    return allBills;
  }, [activeFilter, allBills, myBills, categoryBills]);

  // Apply search filter
  const filteredBills = useMemo(() => {
    if (!searchQuery.trim()) return baseBills;
    const q = searchQuery.toLowerCase();
    return baseBills.filter(
      (bill) =>
        bill.title?.toLowerCase().includes(q) ||
        bill.categoryName?.toLowerCase().includes(q)
    );
  }, [baseBills, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredBills.length / BILLS_PER_PAGE));
  const paginatedBills = useMemo(() => {
    const start = (currentPage - 1) * BILLS_PER_PAGE;
    return filteredBills.slice(start, start + BILLS_PER_PAGE);
  }, [filteredBills, currentPage]);

  // Reset page when filter or search changes
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleAddBill = () => {
    setDialogMode('create');
    setSelectedBill(undefined);
    setIsDialogOpen(true);
  };

  const handleEditBill = (bill: BillResponse) => {
    setDialogMode('edit');
    setSelectedBill(bill);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Bills</h1>

      <BillsHeader
        categories={categories}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
        onAddBill={handleAddBill}
      />

      {/* Bills list */}
      <div className="flex flex-col gap-4 mt-6">
        {isLoadingAll ? (
          <>
            <div className="h-24 w-full bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-24 w-full bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-24 w-full bg-gray-100 rounded-xl animate-pulse" />
          </>
        ) : paginatedBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-gray-50 text-gray-400">
            <p>No bills found.</p>
          </div>
        ) : (
          paginatedBills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              groupId={groupId}
              canEdit={bill.createdBy === currentUser?.id}
              onEdit={handleEditBill}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Bill Dialog */}
      <BillDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        groupId={groupId}
        mode={dialogMode}
        initialData={selectedBill}
      />
    </div>
  );
}
