import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useCrypto } from '../context/CryptoContext';

const PredictionChart = ({ coinId, days = 7 }) => {
  const { prices, predictions, getPrediction } = useCrypto();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadPredictionData = async () => {
      if (!coinId || !prices || !prices[coinId]) {
        return;
      }
      
      setLoading(true);
      
      try {
        // Verificar si necesitamos cargar las predicciones
        if (!predictions[coinId] || predictions[coinId].predictions.length !== days) {
          await getPrediction(coinId, days);
        }
        
        // Ahora deberíamos tener los datos disponibles
        if (predictions[coinId] && prices[coinId]) {
          prepareChartData();
        }
      } catch (error) {
        console.error('Error al cargar predicciones:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const prepareChartData = () => {
      const coinPredictions = predictions[coinId];
      const coinPrices = prices[coinId];
      
      if (!coinPredictions || !coinPrices || !coinPredictions.predictions) {
        return;
      }
      
      // Obtener los últimos 3 puntos de datos históricos
      const historicalData = [...coinPrices.historicalData]
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(-3);
      
      // Formato para las fechas en el eje X
      const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      };
      
      // Etiquetas (fechas) para el eje X
      const labels = [
        ...historicalData.map(point => formatDate(point.timestamp)),
        ...coinPredictions.predictions.map(point => formatDate(point.timestamp))
      ];
      
      // Datos históricos (los últimos 3 puntos)
      const historicalPrices = historicalData.map(point => parseFloat(point.price));
      
      // Datos de predicción
      const predictionPrices = coinPredictions.predictions.map(point => parseFloat(point.price));
      
      // Crear datasets para el gráfico
      const data = {
        labels,
        datasets: [
          {
            label: 'Histórico',
            data: [...historicalPrices, null, ...Array(predictionPrices.length - 1).fill(null)],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 3
          },
          {
            label: 'Predicción',
            data: [...Array(historicalPrices.length - 1).fill(null), historicalPrices[historicalPrices.length - 1], ...predictionPrices],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            fill: true,
            pointRadius: 3
          }
        ]
      };
      
      setChartData(data);
    };
    
    loadPredictionData();
  }, [coinId, days, predictions, prices, getPrediction]);
  
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
        text: `Predicción de ${days} días para ${coinId?.toUpperCase() || ''}`
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            if (context.parsed.y !== null) {
              return `$${context.parsed.y.toFixed(2)}`;
            }
            return '';
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
    }
  };
  
  if (loading) {
    return <div className="chart-loading">Cargando predicciones...</div>;
  }
  
  if (!chartData) {
    return <div className="chart-loading">No hay datos de predicción disponibles</div>;
  }
  
  return (
    <div className="prediction-chart">
      <div className="chart-container" style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PredictionChart; 