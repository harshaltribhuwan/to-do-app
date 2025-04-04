import React, { useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./ToDoMain.scss";

const ToDoMain = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const initialRender = useRef(true);

  const handleTask = useCallback((e) => {
    setTask(e.target.value);
  }, []);

  useEffect(() => {
    const result = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(result);
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

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

  const onDragEnd = (result) => {
    if (!result.destination) return; // Dropped outside

    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);

    setTasks(reorderedTasks);
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

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="taskList">
            {(provided) => (
              <div
                className="task-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tasks.map((t, index) => (
                  <Draggable
                    key={index}
                    draggableId={String(index)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="task-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span>{t}</span>
                        <div className="task-actions">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(index)}
                          >
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
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ToDoMain;
