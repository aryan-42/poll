import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export default function Survey() {
  const { taskId } = useParams();
  const [roll, setRoll] = useState('');
  const [name, setName] = useState('');
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    if (roll) {
      const ref = doc(db, 'participants', roll.toUpperCase());
      getDoc(ref).then(snap => {
        if (snap.exists()) setName(snap.data().name);
        else setName('');
      });
    }
  }, [roll]);

  const submit = async () => {
    if (!roll || !answer) return;
    await setDoc(doc(db, 'responses', roll + '_' + taskId), {
      taskId, roll: roll.toUpperCase(), name, answer, ts: serverTimestamp()
    });
    alert('Submitted!');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Survey {taskId}</h1>
      <label className="block mb-2">Roll Number</label>
      <input value={roll} onChange={e => setRoll(e.target.value.toUpperCase())} className="border p-2 w-full mb-2" />
      {name && <p className="mb-2">Detected Name: {name}</p>}
      <div className="flex gap-4 my-2">
        <button onClick={() => setAnswer('Yes')} className={answer==='Yes'?'bg-green-500 text-white px-4 py-2':'border px-4 py-2'}>Yes</button>
        <button onClick={() => setAnswer('No')} className={answer==='No'?'bg-red-500 text-white px-4 py-2':'border px-4 py-2'}>No</button>
      </div>
      <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
    </div>
  );
}
