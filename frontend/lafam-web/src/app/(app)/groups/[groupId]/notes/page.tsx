import NoteContent from '@/components/main-app/NoteContent';

export default function NotesPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return <NoteContent params={params} />;
}