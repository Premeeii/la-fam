import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function GroupLayout({ children }: { children: React.ReactNode }) {
    return (
       <div className="flex min-h-screen flex-col bg-[#FAF9F6] lg:bg-white">
            <Navbar />
            <div className="flex flex-1 mx-auto w-full max-w-[1600px]">
                <Sidebar />
                <main className="flex-1 w-full p-4 lg:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}