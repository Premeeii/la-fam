'use client';

import { use, useState, useMemo } from 'react';
import { useGroupBills, useMyBills, useBillsByCategory, useBillCategories } from '@/lib/hooks/useBills';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import type { BillResponse } from '@/lib/api/bills';
import { BillsHeader, type SortOption } from '@/components/bills/BillsHeader';
import { BillCard } from '@/components/bills/BillCard';
import { BillDialog } from '@/components/bills/BillDialog';
import { Pagination } from '@/components/bills/Pagination';
import { useGroup } from '@/lib/hooks/useGroup';

const BILLS_PER_PAGE = 5;

export default function BillsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const resolvedParams = use(params);
  const groupId = resolvedParams.groupId;

  const { data: groups } = useGroup();
  
  // Find the group that matches the current URL parameter
  const currentGroup = groups?.find(
    (g) => g.groupId === groupId,
  );

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all'); // 'all' | 'own' | categoryId
  const [sortOrder, setSortOrder] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedBill, setSelectedBill] = useState<BillResponse | undefined>();

  // Data fetching
  const { data: currentUser } = useCurrentUser();
  const { data: categories = [] } = useBillCategories();
  const { data: rawAllBills, isLoading: isLoadingAll } = useGroupBills(groupId, currentPage - 1, BILLS_PER_PAGE);
  const { data: rawMyBills } = useMyBills(groupId);

  // Determine which category is selected for the category query
  const selectedCategoryId = (activeFilter !== 'all' && activeFilter !== 'own') ? activeFilter : null;
  const { data: rawCategoryBills } = useBillsByCategory(groupId, selectedCategoryId);

  // Safely extract bills array (handles both raw Array and Spring Page object { content: [...] })
  const extractBills = (data: any): BillResponse[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.content)) return data.content;
    return [];
  };

  const allBills = useMemo(() => extractBills(rawAllBills), [rawAllBills]);
  const myBills = useMemo(() => extractBills(rawMyBills), [rawMyBills]);
  const categoryBills = useMemo(() => extractBills(rawCategoryBills), [rawCategoryBills]);

  // Choose the right bill list based on filter
  const baseBills = useMemo(() => {
    if (activeFilter === 'own') return myBills;
    if (activeFilter !== 'all') return categoryBills;
    return allBills;
  }, [activeFilter, allBills, myBills, categoryBills]);

  // Apply search filter & sort
  const filteredBills = useMemo(() => {
    let result = baseBills;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (bill) =>
          bill.title?.toLowerCase().includes(q) ||
          bill.categoryName?.toLowerCase().includes(q) ||
          bill.creatorName?.toLowerCase().includes(q)
      );
    }
    
    // Sort bills
    return [...result].sort((a, b) => {
      if (sortOrder === 'oldest') {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateA - dateB;
      }
      if (sortOrder === 'amount_desc') {
        return (b.amount || 0) - (a.amount || 0);
      }
      if (sortOrder === 'amount_asc') {
        return (a.amount || 0) - (b.amount || 0);
      }
      // Default: newest
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [baseBills, searchQuery, sortOrder]);

  // Pagination total pages calculation
  const totalPages = useMemo(() => {
    // If using default view (All bills, no search filter), use backend totalPages
    if (activeFilter === 'all' && !searchQuery.trim() && rawAllBills && typeof rawAllBills.totalPages === 'number') {
      return Math.max(1, rawAllBills.totalPages);
    }
    // Otherwise calculate client-side total pages
    return Math.max(1, Math.ceil(filteredBills.length / BILLS_PER_PAGE));
  }, [activeFilter, searchQuery, rawAllBills, filteredBills.length]);

  const paginatedBills = useMemo(() => {
    // If using default view, backend already returned 5 items for this page
    if (activeFilter === 'all' && !searchQuery.trim()) {
      return filteredBills;
    }
    // Otherwise slice client-side filtered bills
    const start = (currentPage - 1) * BILLS_PER_PAGE;
    return filteredBills.slice(start, start + BILLS_PER_PAGE);
  }, [activeFilter, searchQuery, filteredBills, currentPage]);

  // Reset page when filter, search, or sort changes
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOrder(sort);
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

      <BillsHeader
        groupId={groupId}
        categories={categories}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onAddBill={handleAddBill}
      />

      {/* Bills list */}
      <div className="flex flex-col gap-4 mt-6">
        {isLoadingAll ? (
          <>
            <div className="h-24 w-full bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
            <div className="h-24 w-full bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
            <div className="h-24 w-full bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
          </>
        ) : paginatedBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 rounded-xl text-gray-400 dark:text-gray-500">
            <p>No bills found.</p>
          </div>
        ) : (
          paginatedBills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              groupId={groupId}
              canEdit={bill.createdBy === currentUser?.id || currentGroup?.role === 'OWNER'}
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
