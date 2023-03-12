import { Component, createSignal, createUniqueId } from "solid-js";

interface Todo {
  id: string;
  text: string;
  isCompleted: boolean;
}

const App: Component = () => {
  const [todos, setTodos] = createSignal<Todo[]>([]);

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    const input = e.target as HTMLFormElement;
    const value = input[0].value; // TODO: Fix this

    if (!value) return;

    setTodos([
      ...todos(),
      { id: createUniqueId(), text: value, isCompleted: false },
    ]);
  };

  return (
    <div class="p-2">
      <form onSubmit={handleSubmit}>
        <input
          class="border rounded-lg px-3 py-2 mb-4"
          placeholder="Enter a task"
          type="text"
        />
      </form>
      <div class="text-lg font-bold">Todos</div>
      <ul class="list-disc">
        {todos().map((todo) => (
          <li>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
