'use client';

import { useState } from 'react';
import { useCreateNote } from '@/lib/hooks/useNotes';
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

interface CreateNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

export function CreateNoteDialog({
  isOpen,
  onClose,
  groupId,
}: CreateNoteDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const createMutation = useCreateNote(groupId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createMutation.mutateAsync({
      title: title.trim(),
      content: content.trim() ? content.trim() : undefined,
    });

    setTitle('');
    setContent('');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full sm:max-w-md md:max-w-lg rounded-2xl bg-white p-4 sm:p-6 dark:bg-[#1a1a1e] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Create New Note
          </DialogTitle>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Add a shared note for everyone in this group.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5 text-left">
            <Label htmlFor="note-title" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. WiFi Password, Shopping List, House Rules"
              className="h-10 text-sm"
              autoFocus
              required
            />
          </div>

          <div className="space-y-1.5 text-left">
            <Label htmlFor="note-content" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Content
            </Label>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the details here..."
              rows={6}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-[#252529] dark:text-gray-100"
            />
          </div>

          <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createMutation.isPending}
              className="h-9 px-4 text-xs border-gray-200 dark:border-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || !title.trim()}
              className="h-9 px-4 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Note'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
