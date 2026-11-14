'use client';

import { use, useState, useMemo } from 'react';
import { useGroupNotes } from '@/lib/hooks/useNotes';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { useGroup } from '@/lib/hooks/useGroup';
import type { NoteResponse } from '@/lib/api/notes';
import { NotesHeader, type NoteSortOption } from '@/components/notes/NotesHeader';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteDetailDialog } from '@/components/notes/NoteDetailDialog';
import { CreateNoteDialog } from '@/components/notes/CreateNoteDialog';
import { Pagination } from '@/components/bills/Pagination';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NOTES_PER_PAGE = 12;

export default function NoteContent({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const resolvedParams = use(params);
  const groupId = resolvedParams.groupId;

  const { data: groups } = useGroup();
  const currentGroup = groups?.find((g) => g.groupId === groupId);
  const { data: currentUser } = useCurrentUser();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<NoteSortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNote, setSelectedNote] = useState<NoteResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Data fetching
  const { data: rawNotes, isLoading } = useGroupNotes(
    groupId,
    currentPage - 1,
    NOTES_PER_PAGE
  );

  // Extract notes array
  const notesList = useMemo(() => {
    if (!rawNotes) return [];
    if (Array.isArray(rawNotes)) return rawNotes as NoteResponse[];
    if (rawNotes.content && Array.isArray(rawNotes.content)) {
      return rawNotes.content;
    }
    return [];
  }, [rawNotes]);

  // Client-side search and sorting
  const filteredAndSortedNotes = useMemo(() => {
    let result = [...notesList];

    // Search by title or content
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (note) =>
          note.title?.toLowerCase().includes(q) ||
          note.content?.toLowerCase().includes(q) ||
          note.creatorName?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'oldest') {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateA - dateB;
      }
      if (sortOrder === 'title_asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      // Default: newest by updatedAt / createdAt
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return result;
  }, [notesList, searchQuery, sortOrder]);

  // Total pages
  const totalPages = useMemo(() => {
    if (!searchQuery.trim() && rawNotes && typeof rawNotes.totalPages === 'number') {
      return Math.max(1, rawNotes.totalPages);
    }
    return Math.max(1, Math.ceil(filteredAndSortedNotes.length / NOTES_PER_PAGE));
  }, [rawNotes, searchQuery, filteredAndSortedNotes.length]);

  const paginatedNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return filteredAndSortedNotes;
    }
    const start = (currentPage - 1) * NOTES_PER_PAGE;
    return filteredAndSortedNotes.slice(start, start + NOTES_PER_PAGE);
  }, [filteredAndSortedNotes, searchQuery, currentPage]);

  const handleNoteClick = (note: NoteResponse) => {
    setSelectedNote(note);
    setIsDetailOpen(true);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: NoteSortOption) => {
    setSortOrder(sort);
    setCurrentPage(1);
  };

  const canEditSelectedNote = useMemo(() => {
    if (!selectedNote) return false;
    return (
      selectedNote.createdBy === currentUser?.id ||
      currentGroup?.role === 'OWNER'
    );
  }, [selectedNote, currentUser, currentGroup]);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header with Search, Sort, and Add Note */}
      <NotesHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onAddNote={() => setIsCreateOpen(true)}
      />

      {/* Notes Grid (3 Columns) */}
      <div className="mt-6 flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-xl border border-gray-200/60 dark:border-gray-800 bg-gray-100 dark:bg-[#1f1f23]"
              />
            ))}
          </div>
        ) : paginatedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <FileText className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">
              {searchQuery ? 'No matching notes found' : 'No notes yet'}
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-sm">
              {searchQuery
                ? 'Try searching with different keywords.'
                : 'Create notes to share passwords, checklists, and important memos with your group.'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-9 px-4"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Create your first note
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={handleNoteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Note Detail Dialog (Pop-up on click) */}
      <NoteDetailDialog
        note={selectedNote}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedNote(null);
        }}
        groupId={groupId}
        canEdit={canEditSelectedNote}
      />

      {/* Create Note Dialog */}
      <CreateNoteDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        groupId={groupId}
      />
    </div>
  );
}
