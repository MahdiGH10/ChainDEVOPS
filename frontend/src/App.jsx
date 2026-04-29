import { useState } from 'react'
import { useFetch } from './hooks/useFetch'
import './App.css'

function App() {
  const { data: health, loading: healthLoading, error: healthError, refetch: refetchHealth } = useFetch('/api/health')
  const { data: items, loading: itemsLoading, error: itemsError, refetch: refetchItems } = useFetch('/api/data')
  const [newTitle, setNewTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState('all') // all | completed | incomplete

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    try {
      setSubmitting(true)
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      setNewTitle('')
      await refetchItems()
    } catch (err) {
      window.alert(`Erreur ajout: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleComplete = async (id) => {
    try {
      const response = await fetch(`/api/data/${id}`, {
        method: 'PUT',
      })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      await refetchItems()
    } catch (err) {
      window.alert(`Erreur toggle: ${err.message}`)
    }
  }

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Supprimer cet item ?')) return
    try {
      const response = await fetch(`/api/data/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      await refetchItems()
    } catch (err) {
      window.alert(`Erreur suppression: ${err.message}`)
    }
  }

  return (
    <main className="app">
      <header className="app-header custom-header">
        <h1>🚀 Chainedevops UI Demo</h1>
        <p>Header updated in feature branch 1</p>
      </header>

      <section className="card">
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="filter-items" style={{ fontWeight: 'bold', marginRight: 8 }}>Filtrer:</label>
          <select
            id="filter-items"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ padding: '0.3rem 0.7rem', borderRadius: 6 }}
          >
            <option value="all">Tous</option>
            <option value="completed">Complétés</option>
            <option value="incomplete">Non complétés</option>
          </select>
        </div>
        <h2>État de la connexion backend</h2>
        <div className="card-actions">
          <button onClick={refetchHealth} className="btn-refresh" disabled={healthLoading}>
            🔄 Refresh
          </button>
        </div>

        {healthLoading && <p className="loading">Vérification en cours...</p>}
        {healthError && <p className="error">❌ {healthError}</p>}
        {health && (
          <div className="ok">
            <p>✅ {health.message}</p>
            <p>Status: <strong>{health.status}</strong></p>
            <p>Environment: <strong>{health.environment}</strong></p>
            <p>Uptime: <strong>{Math.round(health.uptime)}s</strong></p>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Items (API Test)</h2>
        <form onSubmit={handleAddItem} className="form-add-item">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Ajouter un item..."
            disabled={submitting}
          />
          <button type="submit" disabled={submitting} className="btn-add">
            {submitting ? 'Ajout...' : '➕ Ajouter'}
          </button>
          <button type="button" onClick={refetchItems} className="btn-refresh" disabled={itemsLoading}>
            🔄 Refresh
          </button>
        </form>

        {itemsLoading && <p className="loading">Chargement...</p>}
        {itemsError && <p className="error">❌ {itemsError}</p>}
        {items && (
          <ul className="items-list">
            {items.items
              ?.filter(item => {
                if (filter === 'completed') return item.completed
                if (filter === 'incomplete') return !item.completed
                return true
              })
              .map((item) => (
                <li key={item.id} className={item.completed ? 'completed' : ''}>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleComplete(item.id)}
                    aria-label={item.completed ? 'Marquer comme non complété' : 'Marquer comme complété'}
                  />
                  <span>{item.title}</span>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteItem(item.id)}
                    aria-label="Supprimer"
                    style={{ marginLeft: 8 }}
                  >🗑️</button>
                </li>
              ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
