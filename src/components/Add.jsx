import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import "./css/Add.css";

const Add = () => {
  // Invoices variables
  const [creditor, setCreditor] = useState('');
  const [concern, setConcern] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [path, setPath] = useState('');
  const [description, setDescription] = useState('');
  const [status] = useState('Ouvert');  // Valeur par défaut "Open"
  const [paymentDate] = useState(''); // Valeur par défaut vide

  const [creditors, setCreditors] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [categories, setCategories] = useState([]);

  // Revenues variables
  const [source, setSource] = useState('');
  const [revenueType, setRevenueType] = useState('');
  const [revenueAmount, setRevenueAmount] = useState('');
  const [receiptDate, setReceiptDate] = useState('');
  const [revenueDescription, setRevenueDescription] = useState('');
  const [revenuePath, setRevenuePath] = useState('');

  const [sources, setSources] = useState([]);
  const [revenueTypes, setRevenueTypes] = useState([]);

  // Admin documents variables
  const [adminDocConcern, setAdminDocConcern] = useState('');
  const [adminDocCategory, setAdminDocCategory] = useState('');
  const [adminDocDescription, setAdminDocDescription] = useState('');
  const [adminDocStatus, setAdminDocStatus] = useState('');
  const [adminDocPath, setAdminDocPath] = useState('');

  const [adminDocumentsConcerns, setAdminDocumentsConcerns] = useState([]);
  const [adminDocumentsCategories, setAdminDocumentsCategories] = useState([]);


  useEffect(() => {

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

    fetchCreditors();
    fetchConcerns();
    fetchCategories();
    fetchSources();
    fetchRevenueTypes();
    fetchAdminDocumentsConcerns();
    fetchAdminDocumentsCategories();
  }, []);

  const handleFileSelect = async (type) => {
    try {
      const selectedPath = await open({
        multiple: false,
        filters: [{
          name: 'Documents',
          extensions: ['pdf', 'doc', 'docx', 'txt']
        }]
      });
  
      if (selectedPath) {
        if (type === 'invoice') {
          setPath(selectedPath);
        } else if (type === 'revenue') {
          setRevenuePath(selectedPath);
        } else if (type === 'admin_document') {
          setAdminDocPath(selectedPath);
        } else if (type === 'taskAttachements') {
          setTaskAttachments(selectedPath);
        }
      } else {
        alert('No file selected');
      }
    } catch (error) {
      console.error('Failed to select file', error);
      alert('Failed to select file');
    }
  };

  const addInvoice = async () => {
    try {
      const data = {
        creditor,
        concern,
        category,
        amount: parseFloat(amount),
        dueDate,
        path,
        description,
        status,
        payment_date: paymentDate,
      };

      // Log des valeurs pour vérifier qu'elles sont correctement définies
      console.log("Data being sent to Rust:", data);

      await invoke('add_invoice', data);
      alert('Invoice added successfully');
    } catch (error) {
      console.error('Failed to add invoice', error);
      alert(`Failed to add invoice: ${error.message}`);
    }
  };

  const addRevenue = async () => {
    try {
      const data = {
        source,
        revenueType,
        amount: parseFloat(revenueAmount),
        receiptDate,
        revenueDescription,
        revenuePath,
      };

      // Log des valeurs pour vérifier qu'elles sont correctement définies
      console.log("Data being sent to Rust:", data);

      await invoke('add_revenue', data);
      alert('Revenue added successfully');
    } catch (error) {
      console.error('Failed to add revenue', error);
      alert(`Failed to add revenue: ${error.message}`);
    }
  };

  const addDocument = async () => {
    try {
      const data = {
        adminDocConcern,
        adminDocCategory,
        adminDocDescription,
        adminDocStatus,
        adminDocPath,
      };

      // Log des valeurs pour vérifier qu'elles sont correctement définies
      console.log("Data being sent to Rust:", data);

      await invoke('add_admin_doc', data);
      alert('Document added successfully');
    } catch (error) {
      console.error('Failed to add document', error);
      alert(`Failed to add document: ${error.message}`);
    }
  };


  return (
    <div className='add-container'>
      <h1>Add</h1>
      <details>
        <summary><p>Add Invoice</p></summary>

        <div className='form-container'>
          <form onSubmit={(e) => { e.preventDefault(); addInvoice(); }}>
            <select 
              value={creditor} 
              onChange={(e) => setCreditor(e.target.value)} 
              required
            >
              <option value="">Select Creditor</option>
              {creditors.map((creditor) => (
                <option key={creditor.id} value={creditor.name}>{creditor.name}</option>
              ))}
            </select>
            <select 
              value={concern} 
              onChange={(e) => setConcern(e.target.value)} 
              required
            >
              <option value="">Select Concern</option>
              {concerns.map((concern) => (
                <option key={concern.id} value={concern.name}>{concern.name}</option>
              ))}
            </select>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <input
              type="date"
              placeholder="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <div className="path-container">
              <input
                type="text"
                placeholder="Path"
                value={path}
                readOnly
              />
              <button type="button" onClick={() => handleFileSelect('invoice')}>Select File</button>
            </div>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Add Invoice</button>
          </form>
        </div>
      </details>
      
      <details>
        <summary><p>Add Revenue</p></summary>
        <div className='form-container'>
          <form onSubmit={(e) => { e.preventDefault(); addRevenue(); }}>
            <select 
              value={source} 
              onChange={(e) => setSource(e.target.value)} 
              required
            >
              <option value="">Select Source</option>
              {sources.map((source) => (
                <option key={source.id} value={source.name}>{source.name}</option>
              ))}
            </select>
            <select 
              value={revenueType} 
              onChange={(e) => setRevenueType(e.target.value)} 
              required
            >
              <option value="">Select Type</option>
              {revenueTypes.map((revenueType) => (
                <option key={revenueType.id} value={revenueType.name}>{revenueType.name}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={revenueAmount}
              onChange={(e) => setRevenueAmount(e.target.value)}
              required
            />

            <input
              type="date"
              placeholder="Receipt Date"
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
              required
            />

            <div className="path-container">
              <input
                type="text"
                placeholder="Path"
                value={revenuePath}
                readOnly
              />
              <button type="button" onClick={() => handleFileSelect('revenue')}>Select File</button>
            </div>

            <input
              type="text"
              placeholder="Description"
              value={revenueDescription}
              onChange={(e) => setRevenueDescription(e.target.value)}
              required
            />

            <button type="submit">Add Revenue</button>
          </form>
        </div>
      </details>

      <details>
        <summary><p>Add Document</p></summary>
        <div className='form-container'>
          <form onSubmit={(e) => { e.preventDefault(); addDocument(); }}>
            <select
              value={adminDocConcern}
              onChange={(e) => setAdminDocConcern(e.target.value)}
              required 
            >
              <option value="">Select Concern</option>
              {adminDocumentsConcerns.map((adminDocConcern) => (
                <option key={adminDocConcern.id} value={adminDocConcern.name}>{adminDocConcern.name}</option>
              ))}
            </select>

            <select
              value={adminDocCategory}
              onChange={(e) => setAdminDocCategory(e.target.value)}
              required 
            >
              <option value="">Select Category</option>
              {adminDocumentsCategories.map((adminDocCategory) => (
                <option key={adminDocCategory.id} value={adminDocCategory.name}>{adminDocCategory.name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Description"
              value={adminDocDescription}
              onChange={(e) => setAdminDocDescription(e.target.value)}
              required
            />

            <select 
              value={adminDocStatus}
              onChange={(e) => setAdminDocStatus(e.target.value)}
              required
            >
              <option value="">Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Canceled">Canceled</option>
              <option value="Sent">Sent</option>
              <option value="Archived">Archived</option>
            </select>

            <div className="path-container">
              <input
                type="text"
                placeholder="Path"
                value={adminDocPath}
                readOnly
              />
              <button type="button" onClick={() => handleFileSelect('admin_document')}>Select File</button>
            </div>

            <button type="submit">Add Document</button>
          </form>
        </div>
      </details>

    </div>
  );
};

export default Add;
