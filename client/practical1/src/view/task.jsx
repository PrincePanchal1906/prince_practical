import { useState, useEffect } from "react";

export default function Task({ setPage }) {
  const [openTable, setOpenTable] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    completed: false,
  });
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    getAllTasks();
  }, []);

  const getAllTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks/get");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/tasks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setFormData({ title: "", completed: false });
        await getAllTasks();
      } else {
        console.error("Error adding task:", data.message);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find((task) => task._id === taskId);
    if (taskToEdit) {
      setEditingTaskId(taskId);
      setFormData({
        title: taskToEdit.title,
        completed: taskToEdit.completed,
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${editingTaskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setEditingTaskId(null);
        setFormData({ title: "", completed: false });
        await getAllTasks();
      } else {
        console.error("Error updating task:", data.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        { method: "DELETE" },
      );
      if (response.ok) {
        await getAllTasks();
      } else {
        console.error("Error deleting task");
      }
    } catch (error) {
      console.error("Error delete task:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setPage("login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Task Page</h1>
      <form
        onSubmit={editingTaskId ? handleUpdate : handleSubmit}
        className="flex flex-col gap-4 px-4 py-2 bg-white rounded shadow-md max-w-md"
      >
        <input
          type="text"
          placeholder="Task title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <label>
          Completed:
          <input
            type="checkbox"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
          />
        </label>
        {editingTaskId ? (
          <button type="submit">Update</button>
        ) : (
          <button type="submit" className="bg-blue-400 px-3 py-2">
            Add Task
          </button>
        )}
        {editingTaskId && (
          <button
            type="button"
            onClick={() => {
              setEditingTaskId(null);
              setFormData({ title: "", completed: false });
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <button onClick={() => setOpenTable((prev) => !prev)}>
        {openTable ? "Close Task Table" : "Open Task Table"}
      </button>
      {openTable && (
        <table className="min-w-full bg-white p-4 mt-4 rounded shadow-md">
          <thead>
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Completed</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2">
                  {task.completed ? "Yes" : "No"}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(task._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <br />
      <br />
      <button onClick={handleLogout}>LogOut</button>
    </div>
  );
}
