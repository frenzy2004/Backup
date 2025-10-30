import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DemographicChartProps {
  data: { office: number; residents: number };
}

const DemographicChart: React.FC<DemographicChartProps> = ({ data }) => {
  const chartData = {
    labels: ['Office Workers', 'Residents'],
    datasets: [
      {
        data: [data.office, data.residents],
        backgroundColor: ['hsl(199, 89%, 48%)', 'hsl(188, 94%, 43%)'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 3,
        hoverBackgroundColor: ['hsl(199, 89%, 42%)', 'hsl(188, 94%, 37%)'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          color: '#374151',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${context.parsed}%`;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
      },
    },
    cutout: '60%',
  };

  return (
    <div className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Demographic Mix</h3>
        <p className="text-muted-foreground text-sm">Local population breakdown</p>
      </div>
      <div className="h-96">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DemographicChart;