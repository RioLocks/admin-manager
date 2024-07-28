import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCalendar, faList } from '@fortawesome/free-solid-svg-icons';
import './css/ToDo.css';
import { invoke } from '@tauri-apps/api/tauri';

Modal.setAppElement('#root');

const ToDo = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('calendar');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Normal',
    due_date: '',
    category: '',
    attachments: '',
  });
  const [editTask, setEditTask] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filter, setFilter] = useState({
    category: '',
    priority: '',
    status: '',
  })

  const [taskCategories, setTaskCategories] = useState([]);
  const [taskPriorities, setTaskPriorities] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchTaskCategories();
    fetchTaskPriorities();
    fetchTaskStatuses();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await invoke('get_tasks');
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const fetchTaskCategories = async () => {
    try {
      const fetchedTaskCategories = await invoke('get_task_categories');
      setTaskCategories(fetchedTaskCategories);
    } catch (error) {
      console.error('Failed to fetch task categories', error);
    }
  };

  const fetchTaskPriorities = async () => {
    try {
      const fetchedTaskPriorities = await invoke('get_task_priorities');
      setTaskPriorities(fetchedTaskPriorities);
    } catch (error) {
      console.error('Failed to fetch task priorities', error);
    }
  };

  const fetchTaskStatuses = async () => {
    try {
      const fetchedTaskStatuses = await invoke('get_task_statuses');
      setTaskStatuses(fetchedTaskStatuses);
    } catch (error) {
      console.error('Failed to fetch task statuses', error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await invoke('add_task', {
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        dueDate: newTask.due_date, // Utilisez dueDate ici
        category: newTask.category,
        attachments: newTask.attachments
      });
      alert('Task added!');
      fetchTasks();
      setNewTask({ title: '', description: '', status: 'Pending', priority: 'Normal', dueDate: '', category: '', attachments: '' });
    } catch (error) {
      console.error('Failed to add task', error);
      alert('Failed to add task');
    }
  };
  

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      await invoke('update_task', {
        id: editTask.id,
        title: editTask.title,
        description: editTask.description,
        status: editTask.status,
        priority: editTask.priority,
        dueDate: editTask.due_date, // Utilisez dueDate ici
        category: editTask.category,
        attachments: editTask.attachments
      });
      alert('Task updated!');
      fetchTasks();
      closeModal();
    } catch (error) {
      console.error('Failed to update task', error);
      alert('Failed to update task');
    }
  };
  

  const deleteTask = async (id) => {
    try {
      await invoke('delete_task', { id });
      alert('Task deleted!');
      fetchTasks();
      closeModal();
    } catch (error) {
      console.error('Failed to delete task', error);
      alert('Failed to delete task');
    }
  };
  

  const transformTasksToEvents = (tasks) => {
    return tasks.map((task) => ({
      id: task.id.toString(),
      title: task.title,
      start: task.due_date,
      description: task.description,
      status: task.status,
      priority: task.priority,
      category: task.category,
      attachments: task.attachments,
    }));
  };

  const handleTaskClick = (info) => {
    const task = tasks.find(t => t.id.toString() === info.event.id);
    setEditTask(task);
    setModalIsOpen(true);
  };

  const handleEditClick = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditTask(task);
      setModalIsOpen(true);
    } else {
      console.error('Task not found');
    }
  };
  

  const closeModal = () => {
    setModalIsOpen(false);
    setEditTask(null);
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = (tasks) => {
    return tasks.filter((task) => {
      return (
        (filter.category === '' || task.category.includes(filter.category)) &&
        (filter.priority === '' || task.priority.includes(filter.priority)) &&
        (filter.status === '' || task.status.includes(filter.status))
      );
    });
  };
  

  const filteredTasks = applyFilters(tasks);

  return (
    <div className="todo-container">
      <h1 className="todo-title">To Do</h1>
      <div className="tab-btns">
        <button title="Calendar" className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
          <FontAwesomeIcon icon={faCalendar} />
        </button>
        <button title="List" className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
          <FontAwesomeIcon icon={faList} />
        </button>
      </div>
      <div className="todo-content">

        {activeTab === 'calendar' && (
          <div className='tab-content todo-tab-content'>
            <div className="calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                firstDay={1} // Lundi comme premier jour de la semaine
                events={transformTasksToEvents(tasks)}
                eventClick={handleTaskClick}
              />
            </div>

            <div className="controls-container">
              <form onSubmit={addTask} className="task-form">
                <h2>Add Task</h2>
                <input type="text" placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
                <textarea placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
                <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
                  <option value="">Select Status</option>
                  {taskStatuses.map((status) => (
                    <option key={status.id} value={status.name}>{status.name}</option>
                  ))}
                </select>
                <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                  <option value="">Select Priority</option>
                  {taskPriorities.map((priority) => (
                    <option key={priority.id} value={priority.name}>{priority.name}</option>
                  ))}
                </select>
                <input type="date" value={newTask.due_date} onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })} required />
                <select value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}>
                  <option value="">Select Category</option>
                  {taskCategories.map((category) => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
                <input type="file" onChange={(e) => setNewTask({ ...newTask, attachments: e.target.files[0].name })} />
                <button type="submit">Add Task</button>
              </form>
            </div>


          </div>
        )}


        {activeTab === 'list' && (
          <div className='tab-content'>
            <div className='filters'>
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={filter.category}
                onChange={handleFilterChange}
              />

              <input
                type="text"
                name="priority"
                placeholder="Priority"
                value={filter.priority}
                onChange={handleFilterChange}
              />

              <input
                type="text"
                name="status"
                placeholder="Status"
                value={filter.status}
                onChange={handleFilterChange}
              />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Creation Date</th>
                  <th>Category</th>
                  <th>Attachments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.status}</td>
                    <td>{task.priority}</td>
                    <td>{task.due_date}</td>
                    <td>{task.creation_date}</td>
                    <td>{task.category}</td>
                    <td>{task.attachments}</td>
                    <td className='actions'> 
                      <button className='edit' onClick={() => handleEditClick(task.id)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className='delete' onClick={() => deleteTask(task.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Task"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {editTask && (
          <form onSubmit={updateTask} className="task-form">
            <h2>Edit Task</h2>
            <input type="text" placeholder="Title" value={editTask.title} onChange={(e) => setEditTask({ ...editTask, title: e.target.value })} required />
            <textarea placeholder="Description" value={editTask.description} onChange={(e) => setEditTask({ ...editTask, description: e.target.value })} />
            <select value={editTask.status} onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select value={editTask.priority} onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}>
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>
            <input type="date" value={editTask.due_date} onChange={(e) => setEditTask({ ...editTask, due_date: e.target.value })} required />
            <input type="text" placeholder="Category" value={editTask.category} onChange={(e) => setEditTask({ ...editTask, category: e.target.value })} />
            <input type="file" onChange={(e) => setEditTask({ ...editTask, attachments: e.target.files[0].name })} />
            <button type="submit">Update</button>
            <button type="button" onClick={() => deleteTask(editTask.id)}>Delete</button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ToDo;
