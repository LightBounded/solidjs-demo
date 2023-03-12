import { Component, createSignal, createUniqueId, onMount } from "solid-js";

interface Todo {
  id: string;
  text: string;
  isCompleted: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onDelete: (todoId: string) => void;
  onUpdate: (todoId: string, todoText: string) => void;
}

interface TodoEditorProps {
  todo: Todo;
  onUpdate: (todoId: string, todoText: string) => void;
  onClose: () => void;
}

const TodoEditor: Component<TodoEditorProps> = ({
  todo,
  onUpdate,
  onClose,
}) => {
  const handleSubmit = (e: Event) => {
    e.preventDefault();

    const input = e.target as HTMLFormElement;
    const value = input[0].value; // TODO: Fix this

    if (!value) return;

    onUpdate(todo.id, value);
    onClose();
  };

  onMount(() => {
    const input = document.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    input.focus();
  });

  return (
    <form onSubmit={handleSubmit} class="inline">
      <input class="rounded border px-1" type="text" value={todo.text} />
    </form>
  );
};

const TodoItem: Component<TodoItemProps> = ({ todo, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = createSignal(false);

  return (
    <li>
      {isEditing() ? (
        <TodoEditor
          todo={todo}
          onUpdate={onUpdate}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <>
          {todo.text}
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            class="rounded border-yellow-500 bg-yellow-500 px-2 py-0.5 text-sm font-semibold text-white"
          >
            Edit
          </button>
          <button
            class="rounded border-red-500 bg-red-500 px-2 py-0.5 text-sm font-semibold text-white"
            onClick={() => onDelete(todo.id)}
          >
            Delete
          </button>
        </>
      )}
    </li>
  );
};

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

    input[0].value = "";
  };

  const deleteTodo = (todoId: string) => {
    const filteredTodos = todos().filter((todo) => todo.id !== todoId);
    setTodos(filteredTodos);
  };

  const updateTodo = (todoId: string, todoText: string) => {
    const updatedTodos = todos().map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, text: todoText };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  return (
    <div class="p-2">
      <form onSubmit={handleSubmit}>
        <input
          class="mb-4 rounded border px-3 py-2"
          placeholder="Enter a task"
          type="text"
        />
      </form>
      <div class="text-lg font-bold">Todos</div>
      <ul class="list-inside list-disc">
        {todos().map((todo) => (
          <TodoItem todo={todo} onDelete={deleteTodo} onUpdate={updateTodo} />
        ))}
      </ul>
    </div>
  );
};

export default App;
