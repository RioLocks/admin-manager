import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { unparse } from 'papaparse';
import PieChart from './PieChart';
import BarChart from './BarChart';
import './css/Dashboard.css';

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [filter, setFilter] = useState({
    category: '',
    concern: '',
    creditor: '',
    month: '',
    status: '',
    source: '',
    revenueType: '',
    revenueMonth: '',
  });

  useEffect(() => {
    fetchInvoices();
    fetchRevenues();
  }, []);

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
          (!filter.month || revenue.receipt_date.startsWith(filter.month))
        );
      });
    }
  };

  const filteredInvoices = applyFilters("invoices");
  const filteredRevenues = applyFilters("revenues");

  const totalAmount = filteredInvoices.reduce((acc, invoice) => acc + invoice.amount, 0);
  const totalRevenues = filteredRevenues.reduce((acc, revenue) => acc + revenue.amount, 0);
  const totalInvoices = filteredInvoices.length;

  const difference = totalRevenues - totalAmount;

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

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
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
        <button className="export-button" onClick={exportToCSV}>Export</button>
      </div>

      <div className='kpis-container'>
        <div className='cards-container'>
          <div className='card'>
            <h2>Total invoices</h2>
            <p>Nb {totalInvoices}: {totalAmount} CHF</p>
          </div>

          <div className='card'>
            <h2>Total Revenues</h2>
            <p>{totalRevenues} CHF</p>
          </div>

          <div className='card'>
            <h2>Difference</h2>
            <p className={difference < 0 ? 'negative' : 'positive'}>
              {difference} CHF
            </p>
          </div>
        </div>
        
        <div className='charts-container'>
          <PieChart invoices={filteredInvoices} />
          <BarChart invoices={filteredInvoices} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
