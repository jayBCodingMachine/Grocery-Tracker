'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import GroceryList from '@/components/GroceryList';
import UserMenu from '@/components/UserMenu';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="container">
      <header style={{
        marginBottom: 'var(--spacing-xl)',
        marginTop: 'var(--spacing-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', letterSpacing: '-0.5px' }}>Grocery List</h1>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Our shared shopping checklist</p>
        </div>
        <UserMenu />
      </header>

      <GroceryList />
    </main>
  )
}
