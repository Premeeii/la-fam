import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-black/80">
      <div className="mx-auto flex h-13 w-full max-w-7xl items-center justify-between px-4 md:px-6 lg:px-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          <Image
            src="/icon.svg"
            alt="La&apos;FAM Logo"
            height={32}
            width={32}
            priority
            className="object-cover"
          />
          <span className="hidden sm:inline">La&apos;FAM</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium cursor-pointer text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Sign in
          </Link>
          <Link href="/register">
            <Button className="cursor-pointer bg-blue-600 px-5 py-4 text-white hover:bg-blue-700 sm:px-6">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white selection:bg-blue-100 dark:bg-black dark:selection:bg-blue-900">
      <LandingNavbar />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:py-20 md:py-32">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center gap-12 px-2 sm:px-6">
          <div className="animate-in fade-in slide-in-from-bottom-4 max-w-5xl space-y-6 duration-1000">
            <h1 className="bg-white text-4xl font-extrabold tracking-tight text-blue-500 sm:text-5xl md:text-8xl dark:text-white">
              La&apos;FAM
            </h1>
            <p className="text-lg leading-8 text-gray-600 sm:text-xl md:text-5xl dark:text-gray-300">
              Let me cook your appointment.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/groups">
                <Button
                  size="lg"
                  className="h-12 rounded-full cursor-pointer bg-blue-600 px-8 text-base font-semibold text-white hover:bg-blue-700 sm:h-14 sm:text-lg"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-400 sm:aspect-video">
            <Image
              src="/openning.webp"
              alt="La&apos;FAM Preview"
              width={1920}
              height={1080}
              className="object-cover object-top sm:object-contain"
              priority
            />
          </div>
          <h1 className="text-lg w-full leading-relaxed text-left text-gray-600 pl-6 pr-10 font-bold sm:text-xl md:text-3xl dark:text-gray-300">
            La&apos;FAM is a family group app for management appointment and receipt to orderly. <br/>Ensure that you don&apos;t forget important things.
          </h1>
           <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-400 sm:aspect-video">
            <Image
              src="/openning2.webp"
              alt="La&apos;FAM Preview"
              width={1920}
              height={1080}
              className="object-cover object-top sm:object-contain"
              priority
            />
          </div>
        </div>
      </main>
      
      <footer className="w-full border-t border-gray-100 bg-white py-6 dark:border-gray-800 dark:bg-black">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-4 px-4 sm:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <Image src="/icon.svg" alt="La'FAM Logo" height={24} width={24} className="object-cover" />
            <span className="font-bold tracking-tight text-gray-900 dark:text-white">La&apos;FAM</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
            <Link href="#" className="transition-colors hover:text-gray-900 dark:hover:text-white">Terms</Link>
            <Link href="#" className="transition-colors hover:text-gray-900 dark:hover:text-white">Privacy</Link>
            <Link href="#" className="transition-colors hover:text-gray-900 dark:hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
