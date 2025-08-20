export default function App() {
  return (
    <main className="max-w-md mx-auto p-4 min-h-screen flex flex-col gap-4">
      <header className="text-center">
        <h1 className="text-2xl font-bold">MBA HRM BATCH OF 25-27</h1>
        <p className="text-gray-600">Simple Yes/No pulse with public roster snapshot.</p>
      </header>
      <section className="grid gap-3">
        <a className="bg-white rounded-xl shadow p-4 border" href="/admin">
          <h2 className="font-semibold">Admin Dashboard</h2>
          <p className="text-sm text-gray-600">Login, upload participants, create tasks, publish roster.</p>
        </a>
        <div className="bg-white rounded-xl shadow p-4 border">
          <h2 className="font-semibold">How to Share a Survey</h2>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
            <li>Create a task in Admin.</li>
            <li>Share <code className="bg-gray-100 px-1 rounded">/survey/&lt;taskId&gt;</code>.</li>
            <li>Students enter Roll, tap Yes/No (no login).</li>
          </ol>
        </div>
      </section>
    </main>
  )
}
