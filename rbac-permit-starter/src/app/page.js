"use client"
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import sampleData from "@/data/sampleData";

export default function Home() {
  const [token, setToken] = useState(sampleData[0]);
  const [user, setUser] = useState("");
  const [todos, setTodos] = useState([]);
  const [todoContent, setTodoContent] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("low");
  const [identifier, setIdentifier] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingDeadline, setEditingDeadline] = useState("");
  const [editingPriority, setEditingPriority] = useState("low");

  useEffect(() => {
    const data = jwtDecode(token);
    const currentUser = data.name;
    const key = data.id;
    setUser(currentUser);
    setIdentifier(key);
  }, [token]);

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);
// Main function to check if specified operation can be performed by the user 
  const checkPermission = async (operation) => {
    const response = await fetch(`/api/check-permission?id=${identifier}&operation=${operation}`);
    const data = await response.json();
    return data.success;
  };
// Function to handle adding todos
  const handleAddTodo = async () => {
    const isAllowed = await checkPermission("create");
    console.log("isAllowed: ", isAllowed);

    if (!isAllowed) {
      alert("You do not have permission to create a to-do.");
      return;
    }

    const newTodo = {
      content: todoContent,
      deadline,
      priority,
      done: false,
    };
    setTodos([...todos, newTodo]);
    setTodoContent("");
    setDeadline("");
    setPriority("low");
  };
// Function to update todos
  const handleToggleDone = async (index) => {
    if (!await checkPermission("update")) {
      alert("You do not have permission to update a to-do.");
      return;
    }

    const updatedTodos = todos.map((todo, i) => 
      i === index ? { ...todo, done: !todo.done } : todo
    );
    setTodos(updatedTodos);
  };
// Function to delete todos
  const handleDeleteTodo = async (index) => {
    if (!await checkPermission("delete")) {
      alert("You do not have permission to delete a to-do.");
      return;
    }

    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const handleEditTodo = (index) => {
    const todo = todos[index];
    setEditingIndex(index);
    setEditingContent(todo.content);
    setEditingDeadline(todo.deadline);
    setEditingPriority(todo.priority);
  };
// Function to edit todos
  const handleSaveEdit = async () => {
    if (!await checkPermission("edit")) {
      alert("You do not have permission to edit a to-do.");
      return;
    }

    const updatedTodos = todos.map((todo, i) =>
      i === editingIndex
        ? { ...todo, content: editingContent, deadline: editingDeadline, priority: editingPriority }
        : todo
    );
    setTodos(updatedTodos);
    setEditingIndex(null);
    setEditingContent("");
    setEditingDeadline("");
    setEditingPriority("low");
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "border-green-500 bg-green-50";
      case "medium":
        return "border-orange-500 bg-orange-50";
      case "high":
        return "border-red-500 bg-red-50";
      default:
        return "";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-16 lg:gap-10 p-8 lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 lg:text-xl">
          <select
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mr-4 p-2 border rounded"
          >
            <option value={sampleData[0]}>Admin</option>
            <option value={sampleData[1]}>User</option>
          </select>
          <div className="flex flex-col lg:flex-row items-start lg:items-center">
            <input
              type="text"
              placeholder="To-do content"
              value={todoContent}
              onChange={(e) => setTodoContent(e.target.value)}
              className="mr-2 p-2 border rounded w-full lg:w-auto mb-2 lg:mb-0"
            />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mr-2 p-2 border rounded w-full lg:w-auto mb-2 lg:mb-0"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mr-2 p-2 border rounded w-full lg:w-auto mb-2 lg:mb-0"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={handleAddTodo}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto grid gap-4 lg:grid-cols-3">
        {todos.map((todo, index) => (
          <div
            key={index}
            className={`p-4 border-4 rounded-lg bg-white shadow-md ${getPriorityColor(todo.priority)}`}
          >
            {editingIndex === index ? (
              <div className="flex flex-col mb-4">
                <input
                  type="text"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="p-2 border rounded mb-2"
                />
                <input
                  type="date"
                  value={editingDeadline}
                  onChange={(e) => setEditingDeadline(e.target.value)}
                  className="p-2 border rounded mb-2"
                />
                <select
                  value={editingPriority}
                  onChange={(e) => setEditingPriority(e.target.value)}
                  className="p-2 border rounded mb-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={handleSaveEdit}
                  className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <h2 className={`font-bold text-xl lg:text-2xl ${todo.done ? "line-through text-gray-600" : ""}`}>{todo.content}</h2>
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => handleToggleDone(index)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                </div>
                <p className="text-gray-500 text-sm lg:text-md font-semibold">{todo.deadline}</p>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleDeleteTodo(index)}
                    className="mr-2 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditTodo(index)}
                    className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                </div>
              </>
            )}

          </div>
        ))}
      </div>
    </main>
  );
}
