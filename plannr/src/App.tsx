import { Circle, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "./components/ui/modal";

type Status = "todo" | "doing" | "done";
type Task = {
  id: string;
  text: string;
  status: Status;
};
function App() {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState("");
  const [error, setError] = useState("");

  const [currentStatus, setCurrentStatus] = useState<Status>("todo");

  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? (JSON.parse(stored) as Task[]) : [];
  });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleSave() {
    if (!task.trim()) {
      setError("A tarefa não pode estar vazia.");
      return;
    }
    setTasks((prev) => {
      if (editingTaskId) {
        return prev.map((t) =>
          t.id === editingTaskId ? { ...t, text: task } : t
        );
      }

      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: task,
          status: currentStatus,
        },
      ];
    });

    setTask("");
    setEditingTaskId(null);
    setError("");
    setOpen(false);
  }

  function handleEdit(task: Task) {
    setTask(task.text);
    setEditingTaskId(task.id);
    setCurrentStatus(task.status);
    setOpen(true);
  }

  function handleDelete(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function moveTask(id: string, status: Status) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task))
    );
  }

  return (
    <div className="min-h-screen h-fit bg-black flex items-center justify-center gap-4 p-8 flex-row">
      <div
        className="  w-full gap-8 md:grid-cols-3 grid 
  grid-cols-1 
  
  lg:grid-cols-3 "
      >
        <div className="max-h-fit p-4 w-full border rounded-xl bg-sky-100 ">
          <div className="justify-start  gap-2 p-8 flex items-center">
            <Circle size={10} fill="blue" color="blue" />
            <h1 className="font-bold">To Do</h1>
          </div>
          <div className="flex justify-center flex-col gap-4">
            <div>
              <button
                onClick={() => {
                  setCurrentStatus("todo");
                  setOpen(true);
                }}
                className="rounded bg-blue-600 px-4 py-2 flex text-white"
              >
                <Plus />
                Adicionar Card
              </button>
            </div>
            <div className="">
              {" "}
              <ul className="space-y-2">
                {tasks
                  .filter((t) => t.status === "todo")
                  .map((t) => (
                    <li key={t.id} className="rounded border p-3 shadow-sm">
                      <div className="flex justify-between">
                        <span>{t.text}</span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => moveTask(t.id, "doing")}
                            className="text-blue-600 text-sm"
                          >
                            → Doing
                          </button>
                          <button onClick={() => handleEdit(t)}>
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-zinc-500 hover:text-red-600 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
              <h2 className="mb-2 text-xl font-bold">Título</h2>
              <textarea
                required
                placeholder="Digite aqui a tarefa"
                value={task}
                onChange={(e) => {
                  setTask(e.target.value);
                  if (error) setError("");
                }}
                className="mx-4 w-[300px] min-h-[120px] rounded-xl border p-2"
              ></textarea>
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

              <button
                onClick={handleSave}
                className="rounded bg-zinc-900 px-4 py-2 text-white"
              >
                Salvar
              </button>
            </Modal>
          </div>
        </div>
        <div className="max-h-fit p-4 w-full border rounded-xl bg-orange-100">
          <div className="justify-start  gap-2 p-8 flex items-center">
            <Circle size={10} fill="blue" color="blue" />
            <h1 className="font-bold">Doing</h1>
          </div>
          <div className="flex justify-center flex-col gap-4">
            <div>
              <button
                onClick={() => {
                  setCurrentStatus("doing");
                  setOpen(true);
                }}
                className="rounded bg-blue-600 px-4 py-2 flex text-white"
              >
                <Plus />
                Adicionar Card
              </button>
            </div>
            <div className="">
              {" "}
              <ul className="space-y-2">
                {tasks
                  .filter((t) => t.status === "doing")
                  .map((t) => (
                    <li key={t.id} className="rounded border p-3 shadow-sm">
                      <div className="flex justify-between">
                        <span>{t.text}</span>

                        <div className="flex gap-2">
                          <button onClick={() => moveTask(t.id, "todo")}>
                            ← To Do
                          </button>
                          <button onClick={() => moveTask(t.id, "done")}>
                            → Done
                          </button>
                          <button onClick={() => handleEdit(t)}>
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-zinc-500 hover:text-red-600 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
              <h2 className="mb-2 text-xl font-bold">Título</h2>
              <textarea
                required
                placeholder="Digite aqui a tarefa"
                value={task}
                onChange={(e) => {
                  setTask(e.target.value);
                  if (error) setError("");
                }}
                className="mx-4 w-[300px] min-h-[120px] rounded-xl border p-2"
              ></textarea>

              <button
                onClick={handleSave}
                className="rounded bg-zinc-900 px-4 py-2 text-white"
              >
                Salvar
              </button>
            </Modal>
          </div>
        </div>

        <div className="max-h-fit p-4 w-full border rounded-xl bg-green-100">
          <div className="justify-start  gap-2 p-8 flex items-center">
            <Circle size={10} fill="blue" color="blue" />
            <h1 className="font-bold">Done</h1>
          </div>
          <div className="flex justify-center flex-col gap-4">
            <div>
              <button
                onClick={() => {
                  setCurrentStatus("done");
                  setOpen(true);
                }}
                className="rounded bg-blue-600 px-4 py-2 flex text-white"
              >
                <Plus />
                Adicionar Card
              </button>
            </div>
            <div className="">
              {" "}
              <ul className="space-y-2">
                {tasks
                  .filter((t) => t.status === "done")
                  .map((t) => (
                    <li key={t.id} className="rounded border p-3 shadow-sm">
                      <div className="flex justify-between">
                        <span>{t.text}</span>

                        <div className="flex gap-2">
                          <button onClick={() => moveTask(t.id, "doing")}>
                            ← Doing
                          </button>

                          <button onClick={() => handleEdit(t)}>
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-zinc-500 hover:text-red-600 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
              <h2 className="mb-2 text-xl font-bold">Título</h2>
              <textarea
                required
                placeholder="Digite aqui a tarefa"
                value={task}
                onChange={(e) => {
                  setTask(e.target.value);
                  if (error) setError("");
                }}
                className="mx-4 w-[300px] min-h-[120px] rounded-xl border p-2"
              ></textarea>
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

              <button
                onClick={handleSave}
                className="rounded bg-zinc-900 px-4 py-2 text-white"
              >
                Salvar
              </button>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
