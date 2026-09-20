import { Navbar } from "@/components/layout/Navbar";
import { SettingsSidebar } from "@/components/layout/SettingsSidebar";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
       <div className="flex min-h-screen flex-col overflow-x-hidden bg-white dark:bg-background lg:bg-white lg:dark:bg-background ">
            <Navbar />
            <div className="flex flex-col lg:flex-row flex-1 mx-auto w-full max-w-[1600px]">
                <SettingsSidebar />
                <main className="flex-1 w-full p-4 lg:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
