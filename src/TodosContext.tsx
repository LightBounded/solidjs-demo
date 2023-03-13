import {
  Accessor,
  createContext,
  createSignal,
  createUniqueId,
  JSX,
  useContext,
} from "solid-js";

export type TodosContextType = {
  todos: Accessor<Todo[]>;
  addTodo: (todoText: string) => void;
  deleteTodo: (todoId: string) => void;
  updateTodo: (todoId: string, todoText: string) => void;
  toggleTodo: (todoId: string) => void;
};

// Provide default values for context
const TodosContext = createContext<TodosContextType>({} as TodosContextType);

export interface Todo {
  id: string;
  text: string;
  isCompleted: boolean;
}

interface Props {
  children: JSX.Element;
}

export const TodosProvider = (props: Props) => {
  const [todos, setTodos] = createSignal<Todo[]>([]);

  const addTodo = (todoText: string) => {
    setTodos([
      ...todos(),
      { id: createUniqueId(), text: todoText, isCompleted: false },
    ]);
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

  const toggleTodo = (todoId: string) => {
    const updatedTodos = todos().map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, isCompleted: !todo.isCompleted };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  return (
    <TodosContext.Provider
      value={{ todos, addTodo, deleteTodo, updateTodo, toggleTodo }}
    >
      {props.children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => {
  return useContext(TodosContext);
};
