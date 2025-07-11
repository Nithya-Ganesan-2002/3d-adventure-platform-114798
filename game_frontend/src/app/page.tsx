import Image from "next/image";
import Link from "next/link";

// SSR-safe homepage for Next.js app -- does not use hooks at top-level!
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            <span>
              Authentication ready: <Link href="/login" className="ml-2 underline text-blue-700">Login</Link> or 
              <Link href="/register" className="ml-2 underline text-green-700">Register</Link>
            </span>
          </li>
          <li>
            Game UI, inventory, progress, leaderboard integration coming soon.
          </li>
        </ol>
      </main>
    </div>
  );
}
