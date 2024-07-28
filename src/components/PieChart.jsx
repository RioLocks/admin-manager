import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale
} from 'chart.js';

// Enregistrer les éléments nécessaires
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale
);

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const generateColorArray = (numColors) => {
  let colorArray = [];
  for (let i = 0; i < numColors; i++) {
    colorArray.push(generateRandomColor());
  }
  return colorArray;
};

const PieChart = ({ invoices }) => {
  const [chartType, setChartType] = useState('creditor');

  const getChartData = () => {
    let labels = [];
    let data = [];

    if (chartType === 'creditor') {
      const creditors = invoices.reduce((acc, invoice) => {
        acc[invoice.creditor] = (acc[invoice.creditor] || 0) + invoice.amount;
        return acc;
      }, {});
      labels = Object.keys(creditors);
      data = Object.values(creditors);
    } else if (chartType === 'month') {
      const months = invoices.reduce((acc, invoice) => {
        const month = invoice.due_date.slice(0, 7); // YYYY-MM format
        acc[month] = (acc[month] || 0) + invoice.amount;
        return acc;
      }, {});
      labels = Object.keys(months);
      data = Object.values(months);
    } else if (chartType === 'status') {
      const statuses = invoices.reduce((acc, invoice) => {
        acc[invoice.status] = (acc[invoice.status] || 0) + invoice.amount;
        return acc;
      }, {});
      labels = Object.keys(statuses);
      data = Object.values(statuses);
    }

    const backgroundColors = generateColorArray(labels.length);
    const hoverBackgroundColors = backgroundColors.map(color => color);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverBackgroundColors
        }
      ]
    };
  };

  return (
    <div className="chart">
      <div className="chart-buttons">
        <button onClick={() => setChartType('creditor')}>Creditor</button>
        <button onClick={() => setChartType('month')}>Month</button>
        <button onClick={() => setChartType('status')}>Status</button>
      </div>
      <Pie data={getChartData()} />
    </div>
  );
};

export default PieChart;
