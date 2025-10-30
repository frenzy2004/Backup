import React from 'react';

interface SuccessScoreChartProps {
  score: number;
}

const SuccessScoreChart: React.FC<SuccessScoreChartProps> = ({ score }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return { color: 'hsl(142, 71%, 45%)', bg: 'bg-success/20', text: 'text-success', border: 'border-success/30' };
    if (score >= 60) return { color: 'hsl(38, 92%, 50%)', bg: 'bg-warning/20', text: 'text-warning', border: 'border-warning/30' };
    return { color: 'hsl(0, 84%, 60%)', bg: 'bg-destructive/20', text: 'text-destructive', border: 'border-destructive/30' };
  };

  const scoreData = getScoreColor(score);
  const getMessage = (score: number) => {
    if (score >= 85) return 'Excellent location with high potential';
    if (score >= 70) return 'Good location with moderate competition';
    if (score >= 55) return 'Average location, consider alternatives';
    return 'Challenging location, high risk';
  };

  return (
    <div className="card-elevated p-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Overall Success Score</h3>
          <p className="text-xs text-muted-foreground">Comprehensive location assessment powered by AI</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-52 h-52 mb-8">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 160 160"
          >
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={scoreData.color}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 1.5s ease-in-out',
                filter: 'drop-shadow(0 0 8px ' + scoreData.color + '40)',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-foreground mb-1">{score}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">/ 100</div>
            </div>
          </div>
        </div>
        <div className={`px-6 py-3 rounded-lg ${scoreData.bg} border ${scoreData.border} text-center max-w-md`}>
          <div className={`text-sm font-semibold ${scoreData.text}`}>{getMessage(score)}</div>
        </div>
      </div>
    </div>
  );
};

export default SuccessScoreChart;