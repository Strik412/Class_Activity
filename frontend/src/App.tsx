import { FormEvent, useEffect, useMemo, useState } from "react";

interface Item {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.id - a.id),
    [items]
  );

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/items`);
      const data = (await res.json()) as Item[];
      setItems(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      if (!res.ok) throw new Error("No se pudo crear");
      const created = (await res.json()) as Item;
      setItems((prev) => [created, ...prev]);
      setTitle("");
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la tarea");
    }
  };

  const toggleDone = async (item: Item) => {
    try {
      const res = await fetch(`${API_URL}/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !item.done })
      });
      if (!res.ok) throw new Error("No se pudo actualizar");
      const updated = (await res.json()) as Item;
      setItems((prev) => prev.map((it) => (it.id === item.id ? updated : it)));
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar la tarea");
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/items/${id}`, {
        method: "DELETE"
      });
      if (!res.ok && res.status !== 204) throw new Error("No se pudo borrar");
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      console.error(err);
      setError("No se pudo borrar la tarea");
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Project</h1>
        <span className="status-pill">API: {API_URL}</span>
      </header>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nueva tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="primary" type="submit" disabled={!title.trim()}>
          Add
        </button>
        <button className="secondary" type="button" onClick={fetchItems}>
          Refreshh
        </button>
      </form>

      {error && <div className="status-pill">{error}</div>}
      {loading && <div className="status-pill">Charging...</div>}

      <div className="list">
        {sortedItems.length === 0 && !loading ? (
          <div className="empty">No tasks yet</div>
        ) : (
          sortedItems.map((item) => (
            <div key={item.id} className={`card ${item.done ? "done" : ""}`}>
              <div className="card-title">{item.title}</div>
              <div className="status-pill">{item.done ? "Done" : "Pending"}</div>
              <div className="actions">
                <button className="secondary" onClick={() => toggleDone(item)}>
                  {item.done ? "Reopen" : "Complete"}
                </button>
                <button className="secondary" onClick={() => deleteItem(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
