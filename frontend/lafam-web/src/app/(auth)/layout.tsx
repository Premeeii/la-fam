import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white lg:flex-row lg:bg-white dark:bg-zinc-950 lg:dark:bg-zinc-950">
      {/* Left side: Image */}
      <div className="relative hidden w-full lg:block lg:h-screen lg:w-1/2 xl:w-[60%]">
        <Image
          src="/cover.webp"
          alt="La'FAM Cover"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Right side: Form */}
      <div className="flex w-full flex-col justify-between bg-[#FFFFFF] px-6 py-8 lg:w-1/2 lg:bg-white lg:px-16 lg:py-12 xl:w-[40%]">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          {/* Logo */}
          <div className="mb-15 flex items-center gap-3">
            <Image
              src="icon.svg"
              alt="La'FAM"
              height={30}
              width={30}
              priority
              className="object-cover"
            />

            <span className="text-xl font-semibold tracking-tight text-gray-900">
              La'FAM
            </span>
          </div>

          {/* Mobile image */}
          <div className="relative mb-6 h-52 w-full overflow-hidden rounded-2xl shadow-sm lg:hidden">
            <Image
              src="/cover.webp"
              alt="La'FAM Cover Mobile"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Form */}
          {children}
        </div>

        {/* Footer */}
        <div className="mx-auto mt-8 flex w-full max-w-md items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-white">
              L
            </div>
          </div>

          <span>© La'FAM 2026</span>
        </div>
      </div>
    </div>
  );
}
