import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useCrypto } from '../context/CryptoContext';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceChart = ({ coinId }) => {
  const { prices } = useCrypto();
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    if (!prices || !coinId || !prices[coinId] || !prices[coinId].historicalData) {
      return;
    }
    
    const coinData = prices[coinId];
    const historicalData = [...coinData.historicalData].sort((a, b) => a.timestamp - b.timestamp);
    
    // Preparar datos para el gráfico
    const labels = historicalData.map(dataPoint => {
      const date = new Date(dataPoint.timestamp);
      return `${date.getHours()}:00`;
    });
    
    const priceData = historicalData.map(dataPoint => parseFloat(dataPoint.price));
    
    // Configurar datos del gráfico
    const data = {
      labels,
      datasets: [
        {
          label: `${coinId.toUpperCase()} Precio (USD)`,
          data: priceData,
          borderColor: getChartColor(coinId),
          backgroundColor: getChartColor(coinId, 0.1),
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 1,
          pointHoverRadius: 5
        }
      ]
    };
    
    setChartData(data);
  }, [coinId, prices]);
  
  // Función para obtener color según la moneda
  const getChartColor = (id, alpha = 1) => {
    const colors = {
      bitcoin: `rgba(247, 147, 26, ${alpha})`,
      ethereum: `rgba(115, 136, 236, ${alpha})`,
      ripple: `rgba(0, 114, 206, ${alpha})`,
      litecoin: `rgba(191, 187, 187, ${alpha})`,
      cardano: `rgba(0, 51, 173, ${alpha})`
    };
    
    return colors[id] || `rgba(75, 192, 192, ${alpha})`;
  };
  
  // Opciones del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Precio últimas 24 horas'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };
  
  if (!chartData) {
    return <div className="chart-loading">Cargando datos del gráfico...</div>;
  }
  
  return (
    <div className="price-chart">
      <div className="chart-container" style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PriceChart; 