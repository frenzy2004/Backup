import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SeasonalDemandChartProps {
  data: { month: string; demand: number; change: number }[];
}

const SeasonalDemandChart: React.FC<SeasonalDemandChartProps> = ({ data }) => {
  // Smart collision detection for labels
  const getAnnotationPositions = () => {
    const annotations: Array<{
      index: number;
      type: 'peak' | 'low';
      demand: number;
      month: string;
      left: number;
      top: number;
    }> = [];

    data.forEach((item, index) => {
      const isPeak = item.demand > 90;
      const isLow = item.demand < 80;
      
      if (isPeak || isLow) {
        annotations.push({
          index,
          type: isPeak ? 'peak' : 'low',
          demand: item.demand,
          month: item.month,
          left: (index / (data.length - 1)) * 100,
          top: 20,
        });
      }
    });

    // Apply collision detection and staggering
    const minDistance = 15; // Minimum distance between labels in percentage
    const staggerOffset = 25; // Vertical offset for staggered labels

    for (let i = 1; i < annotations.length; i++) {
      const current = annotations[i];
      const previous = annotations[i - 1];
      
      if (Math.abs(current.left - previous.left) < minDistance) {
        // Stagger the current annotation
        current.top = previous.top + staggerOffset;
        
        // If it would go too far down, move it up instead
        if (current.top > 70) {
          current.top = Math.max(previous.top - staggerOffset, 5);
        }
      }
    }

    return annotations;
  };

  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: 'Demand Score',
        data: data.map(d => d.demand),
        borderColor: 'hsl(262, 83%, 58%)',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'hsl(262, 83%, 58%)',
        pointBorderColor: 'hsl(240, 10%, 8%)',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
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
          label: (context: TooltipItem<'line'>) => {
            const index = context.dataIndex;
            const change = data[index].change;
            const changeText = change >= 0 ? `+${change}%` : `${change}%`;
            const changeColor = change >= 0 ? 'increase' : 'decrease';
            return [
              `Demand: ${context.parsed.y}`,
              `Change: ${changeText} (${changeColor})`,
            ];
          },
        },
        backgroundColor: 'rgba(15, 15, 25, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#9ca3af',
        borderColor: 'hsl(262, 83%, 58%)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 60,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const annotations = getAnnotationPositions();

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Seasonal Demand Trends</h3>
          <p className="text-xs text-muted-foreground">Monthly demand patterns throughout the year</p>
        </div>
      </div>
      <div className="relative h-96 mb-4">
        {annotations.map((annotation) => (
          <div
            key={`${annotation.index}-${annotation.type}`}
            className={`absolute text-xs px-3 py-1.5 rounded-lg font-medium shadow-sm transition-all duration-300 hover:scale-105 ${
              annotation.type === 'peak'
                ? 'bg-success/20 text-success border border-success/30'
                : 'bg-destructive/20 text-destructive border border-destructive/30'
            }`}
            style={{
              left: `${annotation.left}%`,
              top: `${annotation.top}px`,
              transform: 'translateX(-50%)',
              zIndex: 10,
            }}
          >
            {annotation.type === 'peak' ? 'Peak Season' : 'Low Season'}
            <div className="text-xs opacity-75 mt-0.5">
              {annotation.month}: {annotation.demand}
            </div>
          </div>
        ))}
        <Line data={chartData} options={options} />
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="text-center p-3 bg-background-alt rounded-lg">
          <div className="text-2xl font-bold text-foreground">
            {Math.max(...data.map(d => d.demand))}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Peak Demand</div>
        </div>
        <div className="text-center p-3 bg-background-alt rounded-lg">
          <div className="text-2xl font-bold text-foreground">
            {Math.min(...data.map(d => d.demand))}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Low Demand</div>
        </div>
        <div className="text-center p-3 bg-background-alt rounded-lg">
          <div className="text-2xl font-bold text-foreground">
            {(data.reduce((sum, d) => sum + d.demand, 0) / data.length).toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Average</div>
        </div>
        <div className="text-center p-3 bg-background-alt rounded-lg">
          <div className="text-2xl font-bold text-foreground">
            {(data.reduce((sum, d) => sum + Math.abs(d.change), 0) / data.length).toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Avg Change</div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalDemandChart;