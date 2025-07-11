import './globals.css';
import Link from 'next/link';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: '3D Adventure Game',
  description: 'Explore, play, and compete in an immersive 3D adventure world.',
};

// PUBLIC_INTERFACE
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#3B82F6',
            color: '#fff',
            padding: '1rem 2rem',
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
              3D Adventure
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/">Home</Link>
              <Link href="/game">Game World</Link>
              <Link href="/inventory">Inventory</Link>
              <Link href="/leaderboard">Leaderboard</Link>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </div>
          </nav>
          <main style={{ minHeight: "calc(100vh - 70px)" }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
