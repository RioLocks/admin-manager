// BarChart.jsx
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale
} from 'chart.js';

// Enregistrer les éléments nécessaires
ChartJS.register(
  BarElement,
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

const BarChart = ({ invoices }) => {
  const [chartType, setChartType] = useState('month');

  const getChartData = () => {
    let labels = [];
    let data = [];

    if (chartType === 'month') {
      const months = invoices.reduce((acc, invoice) => {
        const month = invoice.due_date.slice(0, 7); // YYYY-MM format
        acc[month] = (acc[month] || 0) + invoice.amount;
        return acc;
      }, {});
      labels = Object.keys(months);
      data = Object.values(months);
    } else if (chartType === 'category') {
      const categories = invoices.reduce((acc, invoice) => {
        acc[invoice.category] = (acc[invoice.category] || 0) + invoice.amount;
        return acc;
      }, {});
      labels = Object.keys(categories);
      data = Object.values(categories);
    } else if (chartType === 'creditor') {
      const creditors = invoices.reduce((acc, invoice) => {
        acc[invoice.creditor] = (acc[invoice.creditor] || 0) + invoice.amount;
        return acc;
      }, {});
      labels = Object.keys(creditors);
      data = Object.values(creditors);
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

  const options = {
    maintainAspectRatio: false, // Cette option permet de gérer la hauteur manuellement
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      title: {
        display: false
      }
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20
      }
    }
  };

  return (
    <div className="chart">
      <div className="chart-buttons">
        <button onClick={() => setChartType('creditor')}>Creditor</button>
        <button onClick={() => setChartType('category')}>Category</button> 
        <button onClick={() => setChartType('month')}>Month</button>
      </div>
      <div className='chart-data' style={{ height: '250px' }} > {/* Définir la hauteur ici */}
        <Bar data={getChartData()} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
