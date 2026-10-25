'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { alef } from '@/app/fonts';
import TypingText from '@/components/introduction/TypingText';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function IntroductionContent() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col bg-white selection:bg-blue-100 dark:bg-black dark:selection:bg-blue-900">
      <section className="mx-auto flex w-full max-w-[1600px] flex-col items-center px-4 pt-30 pb-20 sm:py-20 md:py-32">
        <Image src="/icon.svg" alt="LaFam Logo" width={100} height={100}></Image>
        <h1 className="text-md mt-10 md:text-3xl">
          <span className="sr-only">LaFam — Group Appointments &amp; Shared Expenses Platform. </span>
          <TypingText />
        </h1>{' '}
        <div className="mt-10">
        <p
          className={` ${alef.className} text-muted-foreground md:text-md mt-4 text-xl`}
        >
          i wish to enhance it
        </p>
        <Link href='/login'>
        <Button
          className="h-10 w-45 cursor-pointer"
        >
          let&apos;s start it
        </Button>
        </Link>
        </div>
      </section>
      
      <div className="relative mx-auto w-90 overflow-hidden rounded-xl border border-black md:border-3 md:w-3/4">
        <Image
          src="/openning.webp"
          alt="LaFam Application Dashboard Preview"
          width={1920}
          height={1080}
          priority
          className="object-cover"
        ></Image>
      </div>
      <footer className="mt-15 w-full">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex flex-row gap-4">
            <Link
              href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
              className={`${alef.className} text-muted-foreground cursor-pointer text-sm hover:underline`}
            >
              Contact
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              href="/privacy-policy"
              className={`${alef.className} text-muted-foreground cursor-pointer text-sm hover:underline`}
            >
              Privacy policy
            </Link>
            <span className='text-muted-foreground'>·</span>
            <Link
              href="/terms"
              className={`${alef.className} text-muted-foreground cursor-pointer text-sm hover:underline`}
            >
              Terms of Service
            </Link>
            <span className='text-muted-foreground'>·</span>
            <Link
              href="https://github.com/Premeeii"
              target="_blank"
              rel="noopener noreferrer"
              className={`${alef.className} text-muted-foreground cursor-pointer text-sm hover:underline`}
            >
              GitHub
            </Link>
          </div>
          <p className={` ${alef.className} text-muted-foreground text-sm`}>
            © 2026 La&apos;FAM All rights reserved @Premeeii
          </p>
        </div>
      </footer>
    </div>
  );
}