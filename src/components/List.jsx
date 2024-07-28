import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import './css/List.css'; 
import { unparse } from 'papaparse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faTrash, faDollarSign, faFileInvoiceDollar, faFileAlt, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

const List = () => {
  const [invoices, setInvoices] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [adminDocuments, setAdminDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('invoices');
  const [filter, setFilter] = useState({
    category: '',
    concern: '',
    creditor: '',
    month: '',
    status: '',
    source: '',
    revenueType: '',
    revenueMonth: '',
    adminDocumentCategory: '',
    adminDocumentConcern: '',
    adminDocumentStatus: '',
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const fetchedInvoices = await invoke('get_invoices');
        setInvoices(fetchedInvoices);
      } catch (error) {
        console.error('Failed to fetch invoices', error);
      }
    };

    const fetchRevenues = async () => {
      try {
        const fetchedRevenues = await invoke('get_revenues');
        setRevenues(fetchedRevenues);
      } catch (error) {
        console.error('Failed to fetch revenues', error);
      }
    };

    const fetchAdminDocuments = async () => {
      try {
        const fetchedAdminDocuments = await invoke('get_admin_docs');
        setAdminDocuments(fetchedAdminDocuments);
      } catch (error) {
        console.error('Failed to fetch admin documents', error);
      }
    };

    fetchInvoices();
    fetchRevenues();
    fetchAdminDocuments();
  }, []);


  // ------------------------------ General functions ------------------------------------
  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = (type) => {
    if (type === 'invoices') {
      return invoices.filter((invoice) => {
        return (
          (!filter.category || invoice.category.includes(filter.category)) &&
          (!filter.concern || invoice.concern.includes(filter.concern)) &&
          (!filter.creditor || invoice.creditor.includes(filter.creditor)) &&
          (!filter.month || invoice.due_date.startsWith(filter.month)) &&
          (!filter.status || invoice.status.includes(filter.status))
        );
      });
    } else if (type === 'revenues') {
      return revenues.filter((revenue) => {
        return (
          (!filter.source || revenue.source.includes(filter.source)) &&
          (!filter.revenueType || revenue.revenue_type.includes(filter.revenueType)) &&
          (!filter.revenueMonth || revenue.receipt_date.startsWith(filter.revenueMonth))
        );
      });
    } else if (type === 'adminDocuments') {
      return adminDocuments.filter((adminDocument) => {
        return (
          (!filter.adminDocumentCategory || adminDocument.admin_doc_category.includes(filter.adminDocumentCategory)) &&
          (!filter.adminDocumentConcern || adminDocument.admin_doc_concern.includes(filter.adminDocumentConcern)) &&
          (!filter.adminDocumentStatus || adminDocument.admin_doc_status.includes(filter.adminDocumentStatus))
        );
      });
    }
  };

  const viewFile = async (path) => {
    if (path) {
      try {
        await invoke('open_file', { path });
      } catch (error) {
        console.error('Failed to open file', error);
        alert('Failed to open file');
      }
    } else {
      alert('No file path available');
    }
  };

  const exportToCSV = () => {
    const csv = unparse(filteredInvoices);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'filtered_invoices.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // ------------------------------ Invoices functions ------------------------------------
  const payInvoice = async (id) => {
    try {
      await invoke('pay_invoice', { id });
      setInvoices(invoices.map(invoice => invoice.id === id ? { ...invoice, status: 'Paye', payment_date: new Date().toISOString().split('T')[0] } : invoice));
      alert('Invoice paid successfully');
    } catch (error) {
      console.error('Failed to pay invoice', error);
      alert('Failed to pay invoice');
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await invoke('delete_invoice', { id });
      setInvoices(invoices.filter(invoice => invoice.id !== id));
      alert('Invoice deleted successfully');
    } catch (error) {
      console.error('Failed to delete invoice', error);
      alert('Failed to delete invoice');
    }
  };



  // ------------------------------ Revenues functions ------------------------------------
  const deleteRevenue = async (id) => {
    try {
      await invoke('delete_revenue', { id });
      setRevenues(revenues.filter(revenue => revenue.id !== id));
      alert('Revenue deleted successfully');
    } catch (error) {
      console.error('Failed to delete revenue', error);
      alert('Failed to delete revenue');
    }
  };



  // ------------------------------ Admin documents functions ------------------------------------
  const deleteAdminDocument = async (id) => {
    try {
      await invoke('delete_admin_doc', { id });
      setAdminDocuments(adminDocuments.filter(adminDocument => adminDocument.id !== id));
      alert('Admin document deleted successfully');
    } catch (error) {
      console.error('Failed to delete admin document', error);
      alert('Failed to delete admin document');
    }
  };

  const filteredInvoices = applyFilters('invoices');
  const filteredRevenues = applyFilters('revenues');
  const filteredAdminDocuments = applyFilters('adminDocuments');

  return (
    <div className='list-container'>
      <h1>Liste des factures et des revenus</h1>
      <div className="tab-btns">
        <button title="Invoices" className={`tab-btn ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')}>
          <FontAwesomeIcon icon={faFileInvoiceDollar} />
        </button>
        <button title="Revenues" className={`tab-btn ${activeTab === 'revenues' ? 'active' : ''}`} onClick={() => setActiveTab('revenues')}>
          <FontAwesomeIcon icon={faDollarSign} />
        </button>
        <button title="Documents" className={`tab-btn ${activeTab === 'adminDocuments' ? 'active' : ''}`} onClick={() => setActiveTab('adminDocuments')}>
          <FontAwesomeIcon icon={faFileAlt} />
        </button>
      </div>

      {activeTab === 'invoices' && (
        <div className="tab-content">
          <div className="filters">
            <input 
              type="text" 
              name="category" 
              placeholder="Category" 
              value={filter.category} 
              onChange={handleFilterChange} 
            />
            <input 
              type="text" 
              name="concern" 
              placeholder="Concern" 
              value={filter.concern} 
              onChange={handleFilterChange} 
            />
            <input 
              type="text" 
              name="creditor" 
              placeholder="Creditor" 
              value={filter.creditor} 
              onChange={handleFilterChange} 
            />
            <input 
              type="month" 
              name="month" 
              placeholder="Month" 
              value={filter.month} 
              onChange={handleFilterChange} 
            />
            <input 
              type="text" 
              name="status" 
              placeholder="Status" 
              value={filter.status} 
              onChange={handleFilterChange} 
            />
            <button className="export-button" onClick={exportToCSV}>Export</button>
          </div>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Creditor</th>
                  <th>Concern</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Due date</th>
                  <th>Path</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Payment date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.creditor}</td>
                    <td>{invoice.concern}</td>
                    <td>{invoice.category}</td>
                    <td>{invoice.amount}</td>
                    <td>{invoice.due_date}</td>
                    <td>
                      {invoice.path && (
                        <button title="View" onClick={() => viewFile(invoice.path)}>
                          <FontAwesomeIcon icon={faFilePdf} />
                        </button>
                      )}
                    </td>
                    <td>{invoice.description}</td>
                    <td>{invoice.status}</td>
                    <td>{invoice.payment_date}</td>
                    <td className="actions">
                      <button title="Pay" className="pay" onClick={() => payInvoice(invoice.id)}>
                        <FontAwesomeIcon icon={faMoneyBillWave} />
                      </button>
                      <button title="Delete" className="delete" onClick={() => deleteInvoice(invoice.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'revenues' && (
        <div className="tab-content">
          <div className="filters">
            <input 
              type="text" 
              name="source" 
              placeholder="Source" 
              value={filter.source} 
              onChange={handleFilterChange} 
            />
            <input 
              type="text" 
              name="revenueType" 
              placeholder="Revenue Type" 
              value={filter.revenueType} 
              onChange={handleFilterChange} 
            />
            <input 
              type="month" 
              name="revenueMonth" 
              placeholder="Revenue Month" 
              value={filter.revenueMonth} 
              onChange={handleFilterChange} 
            />
          </div>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Document</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRevenues.map((revenue) => (
                  <tr key={revenue.id}>
                    <td>{revenue.source}</td>
                    <td>{revenue.revenue_type}</td>
                    <td>{revenue.revenue_amount}</td>
                    <td>{revenue.receipt_date}</td>
                    <td>{revenue.revenue_description}</td>
                    <td>
                      {revenue.path && (
                        <button title="View" onClick={() => viewFile(revenue.revenue_path)}>
                          <FontAwesomeIcon icon={faFilePdf} />
                        </button>
                      )}
                    </td>
                    <td className="actions">
                      <button title="Delete" className="delete" onClick={() => deleteRevenue(revenue.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'adminDocuments' && (
        <div className="tab-content">
          <div className="filters">
            <input 
              type="text" 
              name="adminDocumentConcern" 
              placeholder="Concern" 
              value={filter.adminDocumentConcern} 
              onChange={handleFilterChange} 
            />

            <input 
              type="text" 
              name="adminDocumentCategory" 
              placeholder="Category" 
              value={filter.adminDocumentCategory} 
              onChange={handleFilterChange} 
            />

            <input 
              type="text" 
              name="adminDocumentStatus" 
              placeholder="Status" 
              value={filter.adminDocumentStatus} 
              onChange={handleFilterChange} 
            />

          </div>

          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Concern</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Document</th>
                  <th>Actions</th>
                </tr>

              </thead>
              <tbody>
                {filteredAdminDocuments.map((adminDocument) => (
                  <tr key={adminDocument.id}>
                    <td>{adminDocument.admin_doc_concern}</td>
                    <td>{adminDocument.admin_doc_category}</td>
                    <td>{adminDocument.admin_doc_description}</td>
                    <td>{adminDocument.admin_doc_status}</td>
                    <td>
                      {adminDocument.admin_doc_path && (
                        <button title="View" onClick={() => viewFile(adminDocument.admin_doc_path)}>
                          <FontAwesomeIcon icon={faFilePdf} />
                        </button>
                      )}
                    </td>
                    <td className="actions">
                      <button title="Delete" className="delete" onClick={() => deleteAdminDocument(adminDocument.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>


          </div>



        </div>
      )}
    </div>
  );
};

export default List;
