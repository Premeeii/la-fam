import CalendarContent from "@/components/main-app/CalendarContent";


export default function CalendarPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <CalendarContent params={params}/>
  );
}
