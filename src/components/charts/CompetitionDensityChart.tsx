import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CompetitionDensityChartProps {
  data: { radius: string; category: string; density: number }[];
}

const CompetitionDensityChart: React.FC<CompetitionDensityChartProps> = ({ data }) => {
  const [selectedBar, setSelectedBar] = useState<string | null>(null);

  const restaurantData = data.filter(d => d.category === 'Restaurants');
  const cafeData = data.filter(d => d.category === 'Cafes');

  const chartData = {
    labels: ['1km', '3km', '5km'],
    datasets: [
      {
        label: 'Restaurants',
        data: restaurantData.map(d => d.density),
        backgroundColor: 'hsl(199, 89%, 48%)',
        borderColor: 'hsl(199, 89%, 48%)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Cafes',
        data: cafeData.map(d => d.density),
        backgroundColor: 'hsl(188, 94%, 43%)',
        borderColor: 'hsl(188, 94%, 43%)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          color: '#374151',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.parsed.y} businesses`;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Radius',
          color: '#374151',
        },
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Competitors',
          color: '#374151',
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        },
      },
    },
    onClick: (_event: any, elements: any) => {
      if (elements.length > 0) {
        const element = elements[0];
        const radius = chartData.labels[element.index];
        const category = chartData.datasets[element.datasetIndex].label;
        setSelectedBar(`${category} - ${radius}`);
      }
    },
  };

  return (
    <div className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Competition Density</h3>
        <p className="text-muted-foreground text-sm">Competitor distribution by radius</p>
      </div>
      <div className="h-96 mb-4">
        <Bar data={chartData} options={options} />
      </div>
      {selectedBar && (
        <div className="bg-primary-light border border-primary/20 rounded-lg p-4">
          <div className="text-sm text-foreground">
            <strong>Selected:</strong> {selectedBar}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Click on bars to see detailed breakdown
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionDensityChart;