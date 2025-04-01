import React, { useCallback, useState } from "react";
import "./ToDoMain.scss";

const ToDoMain = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleTask = useCallback((e) => {
    setTask(e.target.value);
  }, []);

  const handleAddandUpdate = () => {
    if (task.trim() === "") return;

    if (editId !== null) {
      const result = tasks.map((d, index) => (index === editId ? task : d));
      setTasks(result);
      setEditId(null);
    } else {
      setTasks([...tasks, task]);
    }
    setTask("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddandUpdate();
    }
  };

  const handleEdit = (index) => {
    setTask(tasks[index]);
    setEditId(index);
  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((_, taskIndex) => taskIndex !== index));
    if (editId === index) {
      setTask("");
      setEditId(null);
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-card">
        <h2>To-Do List</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter task..."
            value={task}
            onChange={handleTask}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleAddandUpdate}>
            {editId !== null ? "Update" : "Add"}
          </button>
        </div>

        <div className="task-list">
          {tasks.map((t, index) => (
            <div key={index} className="task-item">
              <span>{t}</span>
              <div className="task-actions">
                <button className="edit-btn" onClick={() => handleEdit(index)}>
                  ✏️
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(index)}
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToDoMain;
