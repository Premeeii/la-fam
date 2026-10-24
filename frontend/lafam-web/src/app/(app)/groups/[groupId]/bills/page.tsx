import BillsContent from '@/components/main-app/BillContent';

export default function BillsPage({params}: {params: Promise<{groupId: string}>}) {
  
  return (
    <BillsContent params={params} />
  );
}
