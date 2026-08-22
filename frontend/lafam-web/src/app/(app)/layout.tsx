export default function GroupLayout({ children }: { children: React.ReactNode }) {
    return (
       <div className="flex min-h-screen flex-col  px-6">
            <div className="w-full max-w-sm">
                {children}
            </div>
        </div>
    );
}