import { useEffect, useMemo, useState } from 'react'
import LoginGate from './LoginGate'
import { db } from '../firebase'
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'

function AdminInner() {
  const [participants, setParticipants] = useState([])
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState('')
  const [responses, setResponses] = useState([])
  const [title, setTitle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [statusMsg, setStatusMsg] = useState('')

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'participants'), (snap) => {
      const rows = snap.docs.map(d => d.data()).sort((a,b)=> a.roll.localeCompare(b.roll))
      setParticipants(rows)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'tasks'), (snap) => {
      const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      rows.sort((a,b)=> (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0))
      setTasks(rows)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!selectedTask) { setResponses([]); return }
    const q = query(collection(db, 'responses'), where('taskId', '==', selectedTask), orderBy('ts', 'desc'))
    const unsub = onSnapshot(q, (snap) => setResponses(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
    return () => unsub()
  }, [selectedTask])

  const uploadCSV = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const lines = text.replace(/\r\n|\r/g, '\n').split('\n').filter(Boolean)
    let count = 0
    for (const line of lines) {
      const [rollRaw, nameRaw] = line.split(',')
      if (!rollRaw || !nameRaw) continue
      const roll = String(rollRaw).toUpperCase().trim()
      const name = String(nameRaw).trim()
      await setDoc(doc(db, 'participants', roll), { roll, name })
      count++
    }
    setStatusMsg(`Uploaded ${count} participants.`)
  }

  const createTask = async () => {
    if (!title.trim() || !prompt.trim()) { setStatusMsg('Title and Prompt required.'); return }
    const ref = await addDoc(collection(db, 'tasks'), { title: title.trim(), prompt: prompt.trim(), status: 'active', createdAt: serverTimestamp() })
    setTitle(''); setPrompt('')
    setStatusMsg(`Task created: ${ref.id}`)
  }

  const latestByRoll = useMemo(() => {
    const map = new Map()
    for (const r of responses) if (!map.has(r.roll)) map.set(r.roll, r)
    return Array.from(map.values())
  }, [responses])

  const completion = useMemo(() => {
    const total = participants.length
    const done = new Set(latestByRoll.map(r=>r.roll)).size
    const pct = total ? Math.round((done/total)*100) : 0
    return { total, done, pct }
  }, [participants, latestByRoll])

  return (
    <main className="max-w-3xl mx-auto p-4 min-h-screen flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold">Admin — MBA HRM BATCH OF 25-27</h1>
        {statusMsg && <p className="text-sm text-blue-700" aria-live="polite">{statusMsg}</p>}
      </header>

      <section className="bg-white rounded-xl shadow p-4 border grid gap-3">
        <h2 className="font-semibold">Participants</h2>
        <label className="block text-sm">Upload CSV (roll,name)
          <input type="file" accept=".csv" className="mt-1" onChange={uploadCSV} />
        </label>
        <p className="text-sm">Total: {participants.length}</p>
      </section>

      <section className="bg-white rounded-xl shadow p-4 border grid gap-3">
        <h2 className="font-semibold">Create Task</h2>
        <label className="block text-sm">Title<input className="mt-1 w-full border rounded p-2" value={title} onChange={e=>setTitle(e.target.value)} /></label>
        <label className="block text-sm">Prompt<textarea className="mt-1 w-full border rounded p-2" rows={3} value={prompt} onChange={e=>setPrompt(e.target.value)} /></label>
        <button onClick={createTask} className="button-44 bg-blue-600 text-white rounded-lg p-3">Create Task</button>
      </section>

      <section className="bg-white rounded-xl shadow p-4 border grid gap-3">
        <h2 className="font-semibold">Responses</h2>
        <label className="block text-sm">Select Task
          <select className="mt-1 w-full border rounded p-2" value={selectedTask} onChange={e=>setSelectedTask(e.target.value)}>
            <option value="">—</option>
            {tasks.map(t => <option key={t.id} value={t.id}>{t.title} ({t.id})</option>)}
          </select>
        </label>
        {selectedTask && (
          <div className="text-sm">Completed: <strong>{completion.done}</strong> / {completion.total} ({completion.pct}%)</div>
        )}
      </section>
    </main>
  )
}

export default function Admin() {
  return (
    <LoginGate>
      <AdminInner />
    </LoginGate>
  )
}
