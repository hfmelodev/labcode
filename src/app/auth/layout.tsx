import Link from 'next/link'

import Logo from '@/assets/labcode.svg'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen min-h-max w-full flex-col items-center justify-center gap-5 px-6 py-10">
      <Link href="/" className="block w-full max-w-52">
        <Logo />
      </Link>

      {children}
    </main>
  )
}
