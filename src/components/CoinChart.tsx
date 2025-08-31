import { useState, useEffect } from 'react';
import axios from 'axios';
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
  Filler,
} from 'chart.js';
import { format } from 'date-fns';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from '../App.module.css';

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

interface CoinChartProps {
  coinId: string;
}

function CoinChart({ coinId }: CoinChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [days, setDays] = useState(7);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const { data } = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
         );
        
        const formattedData = {
          labels: data.prices.map((price: [number, number]) => format(new Date(price[0]), days === 1 ? 'HH:mm' : 'dd/MM')),
          datasets: [
            {
              label: 'Price (USD)',
              data: data.prices.map((price: [number, number]) => price[1]),
              borderColor: '#D4AF37',
              backgroundColor: 'rgba(212, 175, 55, 0.2)',
              tension: 0.4,
              fill: true,
              pointRadius: 0,
            },
          ],
        };
        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchChartData();
  }, [coinId, days]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#000',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#D4AF37',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#A0A0A0',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#A0A0A0',
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  if (!chartData) {
    return (
      <SkeletonTheme baseColor="var(--bg-surface)" highlightColor="var(--hover-bg)">
        <Skeleton height={400} style={{ marginBottom: '1rem' }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <Skeleton width={50} height={38} />
          <Skeleton width={50} height={38} />
          <Skeleton width={50} height={38} />
          <Skeleton width={50} height={38} />
          <Skeleton width={50} height={38} />
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <div>
      <Line options={options} data={chartData} />
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
        {[1, 7, 30, 90, 365].map((num) => (
          <button 
            key={num} 
            onClick={() => setDays(num)}
            className={`${styles.langButton} ${days === num ? styles.active : ''}`}
          >
            {num}{num === 1 ? 'D' : 'D'}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CoinChart;
