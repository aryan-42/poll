import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'

const toUpper = s => (s||'').toString().toUpperCase().trim()

export default function Survey() {
  const { taskId } = useParams()
  const [sp] = useSearchParams()
  const title = sp.get('title') || 'Quick Pulse'
  const prompt = sp.get('prompt') || 'Please submit your response.'
  const [roll, setRoll] = useState('')
  const rollUC = useMemo(()=>toUpper(roll), [roll])
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    let active = true
    async function lookup() {
      setName('')
      if (!rollUC) return
      const ref = doc(db, 'participants', rollUC)
      const snap = await getDoc(ref)
      if (active) setName(snap.exists() ? snap.data().name : '')
    }
    lookup()
    return () => { active = false }
  }, [rollUC])

  const submit = async (answer) => {
    if (!taskId) return
    if (!rollUC) { setStatus('Enter your Roll Number'); return }
    await addDoc(collection(db, 'responses'), {
      taskId, roll: rollUC, name: name || null, answer: (answer==='Yes'?'Yes':'No'), ts: serverTimestamp()
    })
    setStatus('Response saved. You can resubmit; only the latest counts.')
  }

  return (
    <main className="max-w-md mx-auto p-4 min-h-screen flex flex-col gap-4">
      <header className="text-center">
        <h1 className="text-2xl font-bold">MBA HRM BATCH OF 25-27</h1>
        <p className="text-gray-600 text-sm">Task: {title}</p>
      </header>
      <section className="bg-white rounded-xl shadow p-4 border grid gap-3">
        <p>{prompt}</p>
        <label className="block text-sm">Roll Number
          <input className="mt-1 w-full border rounded p-3 tracking-wider uppercase"
                 value={roll} onChange={e=>setRoll(e.target.value.toUpperCase())}
                 autoCapitalize="characters" autoComplete="off" />
        </label>
        <div className="text-sm text-gray-600 min-h-[1.5rem]" aria-live="polite">
          {rollUC && (name ? `Detected: ${name}` : 'No match found in participant list')}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={()=>submit('Yes')} className="button-44 bg-green-600 text-white rounded-lg p-3">Yes</button>
          <button onClick={()=>submit('No')}  className="button-44 bg-red-600 text-white rounded-lg p-3">No</button>
        </div>
        {status && <div className="text-sm text-blue-700" aria-live="polite">{status}</div>}
      </section>
    </main>
  )
}
