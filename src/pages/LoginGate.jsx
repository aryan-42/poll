import { useEffect, useState } from 'react'
import { auth, googleProvider, db } from '../firebase'
import { signInWithPopup, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export default function LoginGate({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u)
      if (u && u.email) {
        const ref = doc(db, 'admins', u.email)
        const snap = await getDoc(ref)
        setIsAdmin(snap.exists())
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const onGoogle = async () => {
    setError('')
    try { await signInWithPopup(auth, googleProvider) } catch (e) { setError(e.message) }
  }
  const onEmail = async (e) => {
    e.preventDefault()
    setError('')
    try { await signInWithEmailAndPassword(auth, email, password) } catch (e) { setError(e.message) }
  }

  if (loading) return <p className="p-4">Loading…</p>
  if (!user) {
    return (
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-xl font-bold mb-2">Admin Login</h1>
        <button onClick={onGoogle} className="button-44 w-full bg-black text-white rounded-lg p-3">Sign in with Google</button>
        <div className="my-4 text-center text-gray-500">or</div>
        <form onSubmit={onEmail} className="space-y-2">
          <label className="block text-sm">Email<input className="mt-1 w-full border rounded p-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
          <label className="block text-sm">Password<input className="mt-1 w-full border rounded p-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
          <button className="button-44 w-full bg-blue-600 text-white rounded-lg p-3" type="submit">Sign in</button>
        </form>
        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
      </div>
    )
  }
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto p-4">
        <p className="mb-2">Signed in as <strong>{user.email}</strong></p>
        <p className="text-red-600">This account is not authorized for admin access.</p>
        <button onClick={()=>signOut(auth)} className="mt-4 button-44 w-full bg-gray-200 rounded-lg p-3">Sign out</button>
      </div>
    )
  }
  return children
}
