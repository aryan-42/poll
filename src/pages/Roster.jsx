import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function Roster() {
  const { taskId } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      setError('')
      const ref = doc(db, 'rosters', taskId)
      const snap = await getDoc(ref)
      if (!snap.exists()) { setError('Roster not published for this task.'); return }
      if (active) setData(snap.data())
    }
    load()
    return () => { active = false }
  }, [taskId])

  if (error) return <main className="max-w-md mx-auto p-4"><p className="text-red-700">{error}</p></main>
  if (!data) return <main className="max-w-md mx-auto p-4"><p>Loading roster…</p></main>

  const responded = data.responded || []
  const pending = data.pending || []

  return (
    <main className="max-w-md mx-auto p-4 min-h-screen flex flex-col gap-4">
      <header className="text-center">
        <h1 className="text-2xl font-bold">Roster</h1>
        <p className="text-gray-600">Task: {taskId}</p>
      </header>
      <section className="grid md:grid-cols-2 gap-3">
        <div className="bg-white rounded-xl shadow p-4 border">
          <h2 className="font-semibold mb-2">Responded ({responded.length})</h2>
          <ul className="text-sm space-y-1">{responded.map((p,i)=><li key={i}>{p.roll} — {p.name||'—'}</li>)}</ul>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border">
          <h2 className="font-semibold mb-2">Pending ({pending.length})</h2>
          <ul className="text-sm space-y-1">{pending.map((p,i)=><li key={i}>{p.roll} — {p.name||'—'}</li>)}</ul>
        </div>
      </section>
    </main>
  )
}
