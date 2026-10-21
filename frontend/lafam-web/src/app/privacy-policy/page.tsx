'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
        <h1 className="text-primary text-xl font-bold">Privacy Policy</h1>
      </div>
      <div className="mt-10 flex flex-col gap-3 text-black dark:text-white">
        <div className="w-full max-w-4xl text-left">
          <p className="text-md mb-5 opacity-75">
            Last updated on: October 21, 2026
          </p>
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold">Overview</h2>
            <p className="text-md opacity-75">
              At LaFam, we value your privacy and are committed to protecting
              your personal information. This Privacy Policy outlines how we
              collect, use, and safeguard your data when you use our services.
            </p>
          </section>
          <section>
            <h2 className="mt-10 text-xl font-bold">What data we collect</h2>
            <ul className="text-md mt-3 list-disc pl-6 opacity-75">
              <li className="font-bold">Account Information</li>
              <span className="mb-2 block">
                Name, email address, password hash, and profile image.
              </span>
              <li className="font-bold">Group Information</li>
              <span className="mb-2 block">
                Group memberships, invitations, and member roles.
              </span>
              <li className="font-bold">Event Information</li>
              <span className="mb-2 block">
                Events, schedules, and related details you create or participate
                in.
              </span>
              <li className="font-bold">Expense Information</li>
              <span className="mb-2 block">
                Shared bills, expense descriptions, amounts,and related group
                records.
              </span>
              <li className="font-bold">Technical Information</li>
              <span className="mb-2 block">
                IP address,request logs, and information necessary for security
                and troubleshooting.
              </span>
              <li className="font-bold">Authentication Information</li>
              <span className="mb-2 block">
                Session and authentication tokens stored in cookies.
              </span>
            </ul>
          </section>

          <section>
            <h2 className="mt-10 text-xl font-bold">How we collect data</h2>
            <p className="text-md mt-3 opacity-75"></p>
            <p className="text-md opacity-75">
              We collect personal data through the following methods:
            </p>
            <ul className="text-md mt-3 list-disc pl-6 opacity-75">
              <li className="font-bold">Directly provided by you</li>
              <span className="mb-2 block">
                When you create an account, update your profile, create or join
                a group, record shared expenses, schedule events, or upload
                photos.
              </span>
              <li className="font-bold">From other members in your group</li>
              <span className="mb-2 block">
                When another group member invites you to their group or includes
                you in a shared expense or event.
              </span>
              <li className="font-bold">Automatically collected</li>
              <span className="mb-2 block">
                Technical logs (such as IP addresses and request timestamps) are
                automatically logged by our servers for security and
                troubleshooting. Authentication tokens and preferences are saved
                via secure cookies.
              </span>
              <li className="font-bold">Security verification</li>
              <span className="mb-2 block">
                When interacting with forms (like login and registration),
                Cloudflare Turnstile verifies non-bot interaction to protect the
                service.
              </span>
            </ul>
          </section>

          <section>
            <h2 className="mt-10 text-xl font-bold">How we use your data</h2>
            <p className="text-md opacity-75">
              We do not sell or interfere with your personal data for commercial purposes.
            </p>
            <p className="text-md mt-3 opacity-75">We use your data to:</p>
            <ul className="text-md mt-3 list-disc space-y-2 pl-6 opacity-75">
              <li>Provide and improve our services</li>
              <li>Send you notifications</li>
              <li>Protect the security of our services</li>
              <li>Comply with legal requirements</li>
              <li>
                Hosting and VPS Provider(for our backend server and database)
              </li>
            </ul>
          </section>
          <section>
            <h2 className="mt-10 text-xl font-bold">Data retention</h2>
            <p className="text-md opacity-75">
              We keep your data only as long as necessary for the purposes
              described above:
            </p>
            <ul className="text-md mt-3 list-disc space-y-2 pl-6 opacity-75">
              <li>
                Account and bookmark data: Retained while your account remains
                active.
              </li>
              <li>
                If you request deletion, we delete or anonymize your personal
                data within a reasonable period, except where we must retain
                certain information.
              </li>
              <li>
                Short-term logs and technical data may be kept for a limited
                time for debugging and security, then deleted or anonymized.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mt-10 text-xl font-bold">Third-party services</h2>
            <p className="text-md opacity-75">
              Our Service integrates with third-party platform by Cloudflare R2,
              Cloudflare Turnstile and Resend. You can learn more about their
              privacy policies by visiting their websites.
            </p>
          </section>
          <section>
            <h2 className="mt-10 text-xl font-bold">Security</h2>
            <p className="text-md opacity-75">
              We use reasonable technical and organizational measures to protect
              your data, including:
            </p>
            <ul className="text-md mt-3 list-disc space-y-2 pl-6 opacity-75">
              <li> Encrypted connections (HTTPS) where applicable</li>
              <li>Regular security updates and patches</li>
              <li>
                Limiting access to personal data to those who need it to operate
                the Service
              </li>
              <li>
                Authentication tokens are stored exclusively in HttpOnly and
                Secure cookies.
              </li>
              <li>Rate Limiting and Turnstile</li>
            </ul>
            <p className="text-md mt-3 opacity-75">
              No system is perfectly secure, but we work to reduce risks of
              unauthorized access or disclosure.
            </p>
          </section>
          <section className="pb-10">
            <h2 className="mt-10 text-xl font-bold">Contact</h2>
            <p className="text-md mb-5 opacity-75">
              If you have any questions about this Privacy Policy, please
              contact us at{' '}
            </p>
            <Link
              href="mailto:peam972547@gmail.com"
              className="cursor-pointer text-sm text-blue-500 hover:underline"
            >
              <ul className="text-md mt-3 list-disc space-y-2 pl-6 opacity-75">
                <li>peam972547@gmail.com</li>
              </ul>
            </Link>
            <Link
              href="https://github.com/Premeeii"
              target="_blank"
              className="cursor-pointer text-sm text-blue-500 hover:underline"
            >
              <ul className="text-md mt-3 list-disc space-y-2 pl-6 opacity-75">
                <li>GitHub</li>
              </ul>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
