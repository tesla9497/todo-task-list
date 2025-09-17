import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const localValue = localStorage.getItem("TODO");
      return localValue ? JSON.parse(localValue) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("TODO", JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText === "") return;
    setTodos([...todos, { id: Date.now(), text: trimmedText, done: false }]);
    setText("");
  };

  const handleClearAll = () => {
    setTodos([]);
  };

  const handleToggle = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const handleStartEdit = (id) => {
    setEditId(id);
    setEditText(todos.find((todo) => todo.id === id).text);
  };

  const handleEdit = (id) => {
    const trimmedText = editText.trim();
    if (!trimmedText) return;
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: trimmedText } : todo
      )
    );
    handleCancelEdit();
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?"
    );
    if (confirmDelete) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div className="container">
      <h1>Todo List</h1>

      <form className="mb-3 d-flex gap-2" onSubmit={handleSubmit}>
        <input
          className="form-control"
          type="text"
          placeholder="Add a todo"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Add
        </button>
      </form>

      <div className="mb-3 mt-3">
        <button onClick={handleClearAll} className="btn btn-outline-danger">
          Clear All
        </button>
      </div>

      <ul className="list-group">
        {todos.length === 0 && <li className="list-group-item">No todos</li>}
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center gap-2">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggle(todo.id)}
              />
              {editId === todo.id ? (
                <input
                  className="form-control"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <span
                  style={{
                    textDecoration: todo.done ? "line-through" : "none",
                  }}
                >
                  {todo.text}
                </span>
              )}
            </div>
            <div>
              {editId === todo.id ? (
                <>
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => handleEdit(todo.id)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleStartEdit(todo.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
