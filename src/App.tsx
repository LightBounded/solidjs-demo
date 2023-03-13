import { Component, createSignal, onMount } from "solid-js";
import { Todo, useTodos } from "./TodosContext";

const TodoEditor: Component<{ todo: Todo; onClose(): void }> = ({
  todo,
  onClose,
}) => {
  let input: HTMLInputElement | undefined;
  const { updateTodo } = useTodos();
  const [text, setText] = createSignal(todo.text);

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (!text()) return;

    updateTodo(todo.id, text());
    onClose();
  };

  const handleFocusOut = () => {
    if (!text()) return;

    updateTodo(todo.id, text());
    onClose();
  };

  onMount(() => {
    input?.focus();
  });

  return (
    <form onSubmit={handleSubmit} class="inline">
      <input
        ref={input}
        class="rounded border px-1"
        type="text"
        value={text()}
        onChange={(e) => setText((e.target as HTMLInputElement).value)}
        onFocusOut={handleFocusOut}
      />
    </form>
  );
};

const TodoItem: Component<{ todo: Todo }> = ({ todo }) => {
  const { deleteTodo, updateTodo } = useTodos();
  const [isEditing, setIsEditing] = createSignal(false);

  return (
    <li>
      {isEditing() ? (
        <TodoEditor todo={todo} onClose={() => setIsEditing(false)} />
      ) : (
        <>
          {todo.text}
          <button
            onClick={() => setIsEditing(true)}
            class="rounded border-yellow-500 bg-yellow-500 px-2 py-0.5 text-sm font-semibold text-white"
          >
            Edit
          </button>
          <button
            class="rounded border-red-500 bg-red-500 px-2 py-0.5 text-sm font-semibold text-white"
            onClick={() => deleteTodo(todo.id)}
          >
            Delete
          </button>
        </>
      )}
    </li>
  );
};

const TodoForm: Component = () => {
  const { addTodo } = useTodos();

  const [text, setText] = createSignal("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (!text()) return;

    addTodo(text());
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        class="mb-4 rounded border px-3 py-2"
        placeholder="Enter a task"
        type="text"
        value={text()}
        onInput={(e) => setText((e.target as HTMLInputElement).value)}
      />
    </form>
  );
};

const TodoList: Component = () => {
  const { todos } = useTodos();
  return (
    <>
      <div class="text-lg font-bold">Todos</div>
      <ul class="list-inside list-disc">
        {todos().map((todo) => (
          <TodoItem todo={todo} />
        ))}
      </ul>
    </>
  );
};

const App: Component = () => {
  return (
    <div class="p-2">
      <TodoForm />
      <TodoList />
    </div>
  );
};

export default App;
