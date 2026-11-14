'use client';

import type { NoteResponse } from '@/lib/api/notes';
import { Clock, User } from 'lucide-react';

interface NoteCardProps {
  note: NoteResponse;
  onClick: (note: NoteResponse) => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      onClick={() => onClick(note)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(note);
        }
      }}
      className="group flex flex-col justify-between h-56 rounded-xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-[#1f1f23] p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md cursor-pointer text-left"
    >
      {/* Top Section */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-start gap-2.5">
          <h3 className="line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400 transition-colors">
            {note.title}
          </h3>
        </div>

        {/* Content Preview */}
        <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400 whitespace-pre-line">
          {note.content || <span className="italic text-gray-400 dark:text-gray-500">No content</span>}
        </p>
      </div>

      {/* Footer Section */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-[11px] text-gray-400 dark:border-gray-800 dark:text-gray-500">
        <div className="flex items-center gap-1.5 truncate max-w-[55%]">
          <User className="h-3 w-3 shrink-0" />
          <span className="truncate font-medium text-gray-600 dark:text-gray-300">
            {note.creatorName || 'Unknown'}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Clock className="h-3 w-3" />
          <span>{formatDate(note.updatedAt || note.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
