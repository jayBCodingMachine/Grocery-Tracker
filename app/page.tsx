import GroceryList from '@/components/GroceryList';

export default function Home() {
  return (
    <main className="container">
      <header style={{ marginBottom: 'var(--spacing-xl)', marginTop: 'var(--spacing-md)' }}>
        <h1 style={{ fontSize: '1.75rem', letterSpacing: '-0.5px' }}>Grocery List</h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Our shared shopping checklist</p>
      </header>

      <GroceryList />
    </main>
  )
}
