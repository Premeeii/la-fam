'use client';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="mx-auto mt-10 w-full p-2 md:w-2/4">
      <div className="flex items-center gap-3">
        <Button
          variant="link"
          onClick={() => window.history.back()}
          className="cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-primary text-xl font-bold">Terms of Service</h1>
      </div>
      <div className="mt-10 flex flex-col gap-3 text-black dark:text-white">
        <div className="w-full max-w-4xl text-left">
          <p className="text-md mb-5 opacity-75">
            Last updated on: October 21, 2026
          </p>
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold">Overview</h2>
            <p className="text-md opacity-75">
              These Terms of Service ( <strong>“Terms”</strong> ) govern your
              access to and use of the website and related services of LaFam (
              <strong>“we”</strong>, <strong>“us”</strong>, or
              <strong>“our”</strong> ).
            </p>
          </section>
          <section>
            <div className="mt-10">
              <h2 className="text-xl font-bold">Accounts and security</h2>
              <p className="text-md mt-3 opacity-75">
                You create an account by signing up with your email address and
                password. You are responsible for:
              </p>
              <ul className="text-md mt-3 mb-3 list-disc space-y-2 pl-6">
                <li className="opacity-75">
                  Keeping your login details confidential.
                </li>
                <li className="opacity-75">
                  Keeping your devices and browser sessions reasonably secure.
                </li>
                <li className="opacity-75">
                  Not sharing your account with anyone else.
                </li>
              </ul>
              <p className="text-md pl-2">
                We do not store your password in plain text. Your password is
                securely hashed before storage, and the original password cannot
                be directly retrieved from our stored password hash.
              </p>
            </div>
          </section>
          <section>
            <div className="mt-10">
              <h2 className="text-xl font-bold">Description of Service</h2>
              <p className="text-md mt-3 opacity-75">
                La Fam provides tools that help users organize group activities,
                schedules, appointments, and shared expense records.
              </p>
              <p className="text-md mt-3 opacity-75">
                The service is intended to help users coordinate information
                within their groups. Unless explicitly stated otherwise, La Fam
                does not process payments, transfer funds, or independently
                verify the accuracy of user-submitted financial records.
              </p>
            </div>
          </section>
          <section>
            <div className="mt-10">
              <h2 className="text-xl font-bold">Acceptable Use</h2>
              <p className="text-md mt-3 opacity-75">
                You agree not to use LaFam to:
              </p>
              <ul className="text-md mt-3 mb-3 list-disc space-y-2 pl-6">
                <li className="opacity-75">
                  Violate applicable laws or regulations.
                </li>
                <li className="opacity-75">
                  Access accounts, systems, or data without authorization.{' '}
                </li>
                <li className="opacity-75">
                  Interfere with the security, availability, or operation of the
                  service
                </li>
                <li className="opacity-75">
                  Distribute malicious software, spam, or fraudulent content.
                </li>
                <li className="opacity-75">
                  Violate the privacy or rights of other users.
                </li>
              </ul>
            </div>
          </section>
          <section>
            <div className="mt-10">
              <h2 className="text-xl font-bold">Privacy</h2>
              <p className="text-md mt-3 opacity-75">
                Our collection, use, storage, and disclosure of personal
                information are described in our Privacy Policy.
              </p>
              <p className="text-md mt-3 opacity-75">
                Please review our Privacy Policy at
                <a
                  href="/privacy-policy"
                  className="cursor-pointer text-blue-500 hover:underline"
                >
                  {' '}
                  Privacy Policy{' '}
                </a>
                for further information about how we handle personal
                information.
              </p>
            </div>
          </section>
          <section>
            <div className="mt-10">
              <h2 className="text-xl font-bold"> Changes to These Terms</h2>
              <p className="text-md mt-3 opacity-75">
                We may revise these Terms from time to time. We will update the
                "Last Updated" date when changes are made and provide notice of
                material changes where appropriate or required by law.
              </p>
              <p className="text-md mt-3 opacity-75">
                Your continued use of the service after revised Terms take
                effect is subject to applicable law and any required acceptance
                process.
              </p>
            </div>
          </section>
          <section className="pb-10">
            <h2 className="mt-10 text-xl font-bold">Contact</h2>
            <p className="text-md mb-5 opacity-75">
              If you have any questions about this Privacy Policy, please
              contact us at{' '}
            </p>
            <Link
              href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
              className="cursor-pointer text-sm text-blue-500 hover:underline"
            >
              <ul className="text-md mt-3 list-disc space-y-2 pl-6 opacity-75">
                <li>{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</li>
              </ul>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
