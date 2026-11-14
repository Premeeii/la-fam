'use client';

import { useState } from 'react';
import type { NoteResponse } from '@/lib/api/notes';
import { useUpdateNote, useDeleteNote } from '@/lib/hooks/useNotes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Calendar, Clock, Pencil, Trash2, Check, X } from 'lucide-react';

interface NoteDetailDialogProps {
  note: NoteResponse | null;
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  canEdit: boolean;
}

interface NoteDetailContentProps {
  note: NoteResponse;
  groupId: string;
  canEdit: boolean;
  onClose: () => void;
}

function NoteDetailContent({
  note,
  groupId,
  canEdit,
  onClose,
}: NoteDetailContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const updateMutation = useUpdateNote(groupId);
  const deleteMutation = useDeleteNote(groupId);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    await updateMutation.mutateAsync({
      noteId: note.id,
      data: {
        title: title.trim(),
        content: content.trim(),
      },
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(note.id);
    onClose();
  };

  return (
    <DialogContent className="w-[calc(100%-2rem)] sm:w-full sm:max-w-lg md:max-w-xl max-h-[85vh] flex flex-col p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#1a1a1e] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
      <DialogHeader className="space-y-1">
        {isEditing ? (
          <div className="space-y-2 text-left">
            <Label htmlFor="edit-note-title" className="text-xs font-semibold uppercase text-gray-500">
              Title
            </Label>
            <Input
              id="edit-note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="h-10 text-base font-semibold"
              autoFocus
            />
          </div>
        ) : (
          <div className="text-left pr-6">
            <DialogTitle className="text-xl font-bold leading-tight text-gray-900 dark:text-gray-50">
              {note.title}
            </DialogTitle>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-gray-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {note.creatorName || 'Unknown'}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>Created {formatDate(note.createdAt)}</span>
          </div>
          {note.updatedAt && note.updatedAt !== note.createdAt && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Updated {formatDate(note.updatedAt)}
                  {note.updaterName ? ` by ${note.updaterName}` : ''}
                </span>
              </div>
            </>
          )}
        </div>
      </DialogHeader>

      {/* Content Body */}
      <div className="my-4 flex-1 overflow-y-auto pr-1">
        {isEditing ? (
          <div className="space-y-2 text-left">
            <Label htmlFor="edit-note-content" className="text-xs font-semibold uppercase text-gray-500">
              Content
            </Label>
            <textarea
              id="edit-note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={10}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-[#252529] dark:text-gray-100"
            />
          </div>
        ) : (
          <div className="min-h-[140px] rounded-lg bg-gray-50/70 p-4 dark:bg-[#252529]/50">
            {note.content ? (
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                {note.content}
              </p>
            ) : (
              <p className="italic text-sm text-gray-400 dark:text-gray-500">
                No additional content.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <DialogFooter className="flex flex-row items-center justify-between gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <div>
          {canEdit && !isEditing && (
            isConfirmingDelete ? (
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="h-8 px-2.5 text-xs bg-red-600 text-white dark:bg-red-600 dark:text-white hover:bg-red-700 dark:hover:bg-red-700"
                >
                  <Check className="h-3.5 w-3.5 mr-1 text-white dark:text-white" />
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="h-8 px-2.5 text-xs"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsConfirmingDelete(true)}
                className="h-8 px-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete
              </Button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setTitle(note.title || '');
                  setContent(note.content || '');
                  setIsEditing(false);
                }}
                className="h-9 px-3.5 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updateMutation.isPending || !title.trim()}
                className="h-9 px-4 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              {canEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="h-9 px-3.5 text-xs gap-1.5 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
                className="h-9 px-4 text-xs border-gray-200 dark:border-gray-700"
              >
                Close
              </Button>
            </>
          )}
        </div>
      </DialogFooter>
    </DialogContent>
  );
}

export function NoteDetailDialog({
  note,
  isOpen,
  onClose,
  groupId,
  canEdit,
}: NoteDetailDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      {note && (
        <NoteDetailContent
          key={note.id}
          note={note}
          groupId={groupId}
          canEdit={canEdit}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
}
