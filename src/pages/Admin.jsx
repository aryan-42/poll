import React, { useState } from 'react';
import Papa from 'papaparse';
import { db } from '../firebase';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';

export default function Admin() {
  const [csvData, setCsvData] = useState([]);
  const [title, setTitle] = useState('');

  const uploadCSV = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      complete: (res) => {
        res.data.forEach(async row => {
          if(row[0] && row[1]) {
            await setDoc(doc(db, 'participants', row[0].toUpperCase()), {
              roll: row[0].toUpperCase(), name: row[1]
            });
          }
        });
        alert('Uploaded participants');
      }
    });
  };

  const createTask = async () => {
    const ref = await addDoc(collection(db, 'tasks'), {
      title, status: 'active', publicRoster: false
    });
    alert('Task created with ID: ' + ref.id);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
      <input type="file" accept=".csv" onChange={uploadCSV} className="mb-4" />
      <div>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title" className="border p-2" />
        <button onClick={createTask} className="bg-blue-600 text-white px-4 py-2 ml-2">Create Task</button>
      </div>
    </div>
  );
}
