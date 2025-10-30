import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface LocationProfileChartProps {
  data: {
    age: number;
    income: number;
    familySize: number;
    daytimePop: number;
    accessibility: number;
  };
}

const LocationProfileChart: React.FC<LocationProfileChartProps> = ({ data }) => {
  const chartData = {
    labels: ['Age Score', 'Income Level', 'Family Size', 'Daytime Pop.', 'Accessibility'],
    datasets: [
      {
        label: 'Location Profile',
        data: [data.age, data.income, data.familySize, data.daytimePop, data.accessibility],
        backgroundColor: 'rgba(14, 165, 233, 0.15)',
        borderColor: 'hsl(199, 89%, 48%)',
        borderWidth: 3,
        pointBackgroundColor: 'hsl(199, 89%, 48%)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          color: '#374151',
          font: {
            size: 12,
          },
        },
        ticks: {
          color: '#6B7280',
          backdropColor: 'transparent',
        },
      },
    },
  };

  const metrics = [
    { label: 'Competition', score: 75, color: 'bg-warning' },
    { label: 'Demand', score: 88, color: 'bg-success' },
    { label: 'Accessibility', score: 95, color: 'bg-primary' },
    { label: 'Demographics', score: 82, color: 'bg-accent' },
  ];

  return (
    <div className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Location Profile</h3>
        <p className="text-muted-foreground text-sm">Key location characteristics</p>
      </div>
      <div className="h-96 mb-6">
        <Radar data={chartData} options={options} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-bold text-foreground">{metric.score}</div>
            <div className="text-sm text-muted-foreground mb-2">{metric.label}</div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full ${metric.color} transition-all duration-1000`}
                style={{ width: `${metric.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationProfileChart;