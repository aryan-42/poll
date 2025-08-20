import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginGate({children}) {
  const [user, setUser] = useState(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const ref = doc(db, 'admins', u.email);
        const snap = await getDoc(ref);
        if (snap.exists()) setAllowed(true);
      } else setUser(null);
    });
    return () => unsub();
  }, []);

  const login = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  if (!user) return <button onClick={login} className="p-2 bg-blue-500 text-white">Login with Google</button>;
  if (!allowed) return <div>Not authorized</div>;
  return <>{children}</>;
}
