import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface CompetitorChartProps {
  data: { name: string; size: number; rating: number; distance: number }[];
}

const CompetitorChart: React.FC<CompetitorChartProps> = ({ data }) => {
  const chartData = {
    datasets: [
      {
        label: 'Competitors',
        data: data.map(item => ({
          x: item.size,
          y: item.rating,
          name: item.name,
          distance: item.distance,
        })),
        backgroundColor: 'rgba(14, 165, 233, 0.6)',
        borderColor: 'hsl(199, 89%, 48%)',
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: () => '',
          label: (context: any) => {
            const point = context.raw;
            return [
              `Business: ${point.name}`,
              `Size: ${point.x} seats`,
              `Rating: ${point.y} stars`,
              `Distance: ${point.distance}km`,
            ];
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'hsl(199, 89%, 48%)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Business Size (seats)',
          color: '#374151',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Average Rating',
          color: '#374151',
        },
        min: 3.5,
        max: 5,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        },
      },
    },
  };

  return (
    <div className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Competitor Analysis</h3>
        <p className="text-muted-foreground text-sm">Size vs Rating comparison</p>
      </div>
      <div className="h-96">
        <Scatter data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CompetitorChart;