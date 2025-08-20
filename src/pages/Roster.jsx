import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Roster() {
  const { taskId } = useParams();
  const [roster, setRoster] = useState(null);

  useEffect(() => {
    const ref = doc(db, 'rosters', taskId);
    getDoc(ref).then(snap => {
      if (snap.exists()) setRoster(snap.data());
    });
  }, [taskId]);

  if (!roster) return <div className="p-4">No roster published.</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Roster for Task {taskId}</h1>
      <h2 className="font-semibold">Responded</h2>
      <ul>{roster.responded.map(r => <li key={r}>{r}</li>)}</ul>
      <h2 className="font-semibold mt-4">Pending</h2>
      <ul>{roster.pending.map(r => <li key={r}>{r}</li>)}</ul>
    </div>
  );
}
