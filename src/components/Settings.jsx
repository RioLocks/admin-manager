import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faFileInvoiceDollar, faDollarSign, faFileAlt, faTasks } from '@fortawesome/free-solid-svg-icons';
import './css/Settings.css'; 

const Settings = () => {
  // General variables 
  const [activeTab, setActiveTab] = useState('invoices');
  // Invoices variables
  const [creditors, setCreditors] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCreditor, setNewCreditor] = useState('');
  const [newConcern, setNewConcern] = useState('');
  const [newCategory, setNewCategory] = useState('');

  // Revenues variables
  const [sources, setSources] = useState([]);
  const [revenueTypes, setRevenueTypes] = useState([]);
  const [newSource, setNewSource] = useState('');
  const [newRevenueType, setNewRevenueType] = useState('');


  // Admin documents variables
  const [adminDocumentsConcerns, setAdminDocumentsConcerns] = useState([]);
  const [adminDocumentsCategories, setAdminDocumentsCategories] = useState([]);
  const [newAdminDocumentConcern, setNewAdminDocumentConcern] = useState('');
  const [newAdminDocumentCategory, setNewAdminDocumentCategory] = useState('');

  // Tasks variables
  const [taskCategories, setTaskCategories] = useState([]);
  const [taskPriorities, setTaskPriorities] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('');

  useEffect(() => {
    fetchCreditors();
    fetchConcerns();
    fetchCategories();
    fetchSources();
    fetchRevenueTypes();
    fetchAdminDocumentsConcerns();
    fetchAdminDocumentsCategories();
    fetchTaskCategories();
    fetchTaskPriorities();
    fetchTaskStatuses();
  }, []);

  // Tasks functions
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

  const addTaskCategory = async () => {
    try {
      await invoke('add_task_category', { name: newTaskCategory });
      setNewTaskCategory('');
      fetchTaskCategories();
    } catch (error) {
      console.error('Failed to add task category', error);
      alert('Failed to add task category');
    }
  };

  const addTaskPriority = async () => {
    try {
      await invoke('add_task_priority', { name: newTaskPriority });
      setNewTaskPriority('');
      fetchTaskPriorities();
    } catch (error) {
      console.error('Failed to add task priority', error);
      alert('Failed to add task priority');
    }
  };

  const addTaskStatus = async () => {
    try {
      await invoke('add_task_status', { name: newTaskStatus });
      setNewTaskStatus('');
      fetchTaskStatuses();
    } catch (error) {
      console.error('Failed to add task status', error);
      alert('Failed to add task status');
    }
  };

  const deleteTaskCategory = async (id) => {
    try {
      await invoke('delete_task_category', { id });
      fetchTaskCategories();
    } catch (error) {
      console.error('Failed to delete task category', error);
      alert('Failed to delete task category');
    }
  };

  const deleteTaskPriority = async (id) => {
    try {
      await invoke('delete_task_priority', { id });
      fetchTaskPriorities();
    } catch (error) {
      console.error('Failed to delete task priority', error);
      alert('Failed to delete task priority');
    }
  };

  const deleteTaskStatus = async (id) => {
    try {
      await invoke('delete_task_status', { id });
      fetchTaskStatuses();
    } catch (error) {
      console.error('Failed to delete task status', error);
      alert('Failed to delete task status');
    }
  };

  // Admin documents functions
  const fetchAdminDocumentsConcerns = async () => {
    try {
      const fetchedAdminDocumentsConcerns = await invoke('get_admin_document_concerns');
      setAdminDocumentsConcerns(fetchedAdminDocumentsConcerns);
    } catch (error) {
      console.error('Failed to fetch admin documents concerns', error);
    }
  };

  const fetchAdminDocumentsCategories = async () => {
    try {
      const fetchedAdminDocumentsCategories = await invoke('get_admin_document_categories');
      setAdminDocumentsCategories(fetchedAdminDocumentsCategories);
    } catch (error) {
      console.error('Failed to fetch admin documents categories', error);
    }
  };

  const addAdminDocumentConcern = async () => {
    try {
      await invoke('add_admin_document_concern', { name: newAdminDocumentConcern });
      setNewAdminDocumentConcern('');
      fetchAdminDocumentsConcerns();
    } catch (error) {
      console.error('Failed to add admin document concern', error);
    }
  };

  const addAdminDocumentCategory = async () => {
    try {
      await invoke('add_admin_document_category', { name: newAdminDocumentCategory });
      setNewAdminDocumentCategory('');
      fetchAdminDocumentsCategories();
    } catch (error) {
      console.error('Failed to add admin document category', error);
    }
  };

  const deleteAdminDocumentConcern = async (id) => {
    try {
      await invoke('delete_admin_document_concern', { id });
      fetchAdminDocumentsConcerns();
    } catch (error) {
      console.error('Failed to delete admin document concern', error);
    }
  };

  const deleteAdminDocumentCategory = async (id) => {
    try {
      await invoke('delete_admin_document_category', { id });
      fetchAdminDocumentsCategories();
    } catch (error) {
      console.error('Failed to delete admin document category', error);
    }
  };

  // Invoices functions
  const fetchCreditors = async () => {
    try {
      const fetchedCreditors = await invoke('get_creditors');
      setCreditors(fetchedCreditors);
    } catch (error) {
      console.error('Failed to fetch creditors', error);
    }
  };

  const fetchConcerns = async () => {
    try {
      const fetchedConcerns = await invoke('get_concerns');
      setConcerns(fetchedConcerns);
    } catch (error) {
      console.error('Failed to fetch concerns', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await invoke('get_categories');
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const addCreditor = async () => {
    try {
      await invoke('add_creditor', { name: newCreditor });
      setNewCreditor('');
      fetchCreditors();
    } catch (error) {
      console.error('Failed to add creditor', error);
    }
  };

  const addConcern = async () => {
    try {
      await invoke('add_concern', { name: newConcern });
      setNewConcern('');
      fetchConcerns();
    } catch (error) {
      console.error('Failed to add concern', error);
    }
  };

  const addCategory = async () => {
    try {
      await invoke('add_category', { name: newCategory });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      console.error('Failed to add category', error);
    }
  };

  const deleteCreditor = async (id) => {
    try {
      await invoke('delete_creditor', { id });
      fetchCreditors();
    } catch (error) {
      console.error('Failed to delete creditor', error);
    }
  };

  const deleteConcern = async (id) => {
    try {
      await invoke('delete_concern', { id });
      fetchConcerns();
    } catch (error) {
      console.error('Failed to delete concern', error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await invoke('delete_category', { id });
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category', error);
    }
  };


  // Revenues functions
  const fetchSources = async () => {
    try {
      const fetchedSources = await invoke('get_sources');
      setSources(fetchedSources);
    } catch (error) {
      console.error('Failed to fetch sources', error);
    }
  };

  const fetchRevenueTypes = async () => {
    try {
      const fetchedRevenueTypes = await invoke('get_revenue_types');
      setRevenueTypes(fetchedRevenueTypes);
    } catch (error) {
      console.error('Failed to fetch revenue types', error);
    }
  };

  const addSource = async () => {
    try {
      await invoke('add_source', { name: newSource });
      setNewSource('');
      fetchSources();
    } catch (error) {
      console.error('Failed to add source', error);
    }
  };

  const addRevenueType = async () => {
    try {
      await invoke('add_revenue_type', { name: newRevenueType });
      setNewRevenueType('');
      fetchRevenueTypes();
    } catch (error) {
      console.error('Failed to add revenue type', error);
    }
  };

  const deleteSource = async (id) => {
    try {
      await invoke('delete_source', { id });
      fetchSources();
    } catch (error) {
      console.error('Failed to delete source', error);
    }
  };

  const deleteRevenueType = async (id) => {
    try {
      await invoke('delete_revenue_type', { id });
      fetchRevenueTypes();
    } catch (error) {
      console.error('Failed to delete revenue type', error);
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      <div className="tab-btns settings-tab-btns">
        <button title="Invoices" className={`tab-btn ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')}>
          <FontAwesomeIcon icon={faFileInvoiceDollar} />
        </button>
        <button title="Revenues" className={`tab-btn ${activeTab === 'revenues' ? 'active' : ''}`} onClick={() => setActiveTab('revenues')}>
          <FontAwesomeIcon icon={faDollarSign} />
        </button>
        <button title="Documents" className={`tab-btn ${activeTab === 'admin_docs' ? 'active' : ''}`} onClick={() => setActiveTab('admin_docs')}>
          <FontAwesomeIcon icon={faFileAlt} />
        </button>
        <button title="Tasks" className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
          <FontAwesomeIcon icon={faTasks} />
        </button>
      </div>

      {activeTab === 'invoices' && (
        <div className="tab-content">
          <div className="section">
            <h2>Creditors</h2>
            <input
              type="text"
              placeholder="New Creditor"
              value={newCreditor}
              onChange={(e) => setNewCreditor(e.target.value)}
            />
            <button onClick={addCreditor}>Add</button>
            <div className='section-list-container'>
              <ul>
                {creditors.map((creditor) => (
                  <li key={creditor.id}>
                    {creditor.name}
                    <button onClick={() => deleteCreditor(creditor.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>
          <div className="section">
            <h2>Concerns</h2>
            <input
              type="text"
              placeholder="New Concern"
              value={newConcern}
              onChange={(e) => setNewConcern(e.target.value)}
            />
            <button onClick={addConcern}>Add</button>
            <div className='section-list-container'>
              <ul>
                {concerns.map((concern) => (
                  <li key={concern.id}>
                    {concern.name}
                    <button onClick={() => deleteConcern(concern.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>
          <div className="section">
            <h2>Categories</h2>
            <input
              type="text"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={addCategory}>Add</button>
            <div className='section-list-container'>
              <ul>
                {categories.map((category) => (
                  <li key={category.id}>
                    {category.name}
                    <button onClick={() => deleteCategory(category.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>


        </div>

      )}

      {activeTab === 'revenues' && (
        <div className="tab-content">

          <div className="section">
            <h2>Sources</h2>
            <input
              type="text"
              placeholder="New Source"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
            />
            <button onClick={addSource}>Add</button>
            <div className='section-list-container'>
              <ul>
                {sources.map((source) => (
                  <li key={source.id}>
                    {source.name}
                    <button onClick={() => deleteSource(source.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="section">
            <h2>Revenue Types</h2>
            <input
              type="text"
              placeholder="New Revenue Type"
              value={newRevenueType}
              onChange={(e) => setNewRevenueType(e.target.value)}
            />
            <button onClick={addRevenueType}>Add</button>
            <div className='section-list-container'>
              <ul>
                {revenueTypes.map((revenueType) => (
                  <li key={revenueType.id}>
                    {revenueType.name}
                    <button onClick={() => deleteRevenueType(revenueType.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'admin_docs' && (
        <div className="tab-content">
          <div className="section">
            <h2>Admin Concerns</h2>
            <input
              type="text"
              placeholder="New Concern"
              value={newAdminDocumentConcern}
              onChange={(e) => setNewAdminDocumentConcern(e.target.value)}
            />
            <button onClick={addAdminDocumentConcern}>Add</button>
            <div className='section-list-container'>
              <ul>
                {adminDocumentsConcerns.map((adminDocumentConcern) => (
                  <li key={adminDocumentConcern.id}>
                    {adminDocumentConcern.name}
                    <button onClick={() => deleteAdminDocumentConcern(adminDocumentConcern.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="section">
            <h2>Admin categories</h2>
            <input
              type="text"
              placeholder="New Category"
              value={newAdminDocumentCategory}
              onChange={(e) => setNewAdminDocumentCategory(e.target.value)}
            />
            <button onClick={addAdminDocumentCategory}>Add</button>
            <div className='section-list-container'>
              <ul>
                {adminDocumentsCategories.map((adminDocumentCategory) => (
                  <li key={adminDocumentCategory.id}>
                    {adminDocumentCategory.name}
                    <button onClick={() => deleteAdminDocumentCategory(adminDocumentCategory.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="tab-content">
          <div className="section">
            <h2>Categories</h2>
            <input 
              type="text"
              placeholder="New Category"
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
            />
            <button onClick={addTaskCategory}>Add</button>
            <div className='section-list-container'>
              <ul>
                {taskCategories.map((taskCategory) => (
                  <li key={taskCategory.id}>
                    {taskCategory.name}
                    <button onClick={() => deleteTaskCategory(taskCategory.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="section">
            <h2>Priorities</h2>
            <input 
              type="text"
              placeholder="New Priority"
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
            />
            <button onClick={addTaskPriority}>Add</button>
            <div className='section-list-container'>
              <ul>
                {taskPriorities.map((taskPriority) => (
                  <li key={taskPriority.id}>
                    {taskPriority.name}
                    <button onClick={() => deleteTaskPriority(taskPriority.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>


          <div className="section">
            <h2>Statuses</h2>
            <input 
              type="text"
              placeholder="New Status"
              value={newTaskStatus}
              onChange={(e) => setNewTaskStatus(e.target.value)}
            />
            <button onClick={addTaskStatus}>Add</button>
            <div className='section-list-container'>
              <ul>
                {taskStatuses.map((taskStatus) => (
                  <li key={taskStatus.id}>
                    {taskStatus.name}
                    <button onClick={() => deleteTaskStatus(taskStatus.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>


        </div>
      )}

    </div>
  );
};

export default Settings;
