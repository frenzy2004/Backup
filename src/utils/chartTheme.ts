// Dark theme configuration for all Chart.js charts
export const darkChartColors = {
  primary: 'hsl(262, 83%, 58%)',
  primaryRgba: 'rgba(139, 92, 246, 0.15)',
  secondary: 'hsl(330, 81%, 60%)',
  accent: 'hsl(217, 91%, 60%)',
  success: 'hsl(142, 71%, 45%)',
  destructive: 'hsl(0, 84%, 60%)',
  warning: 'hsl(38, 92%, 50%)',
  background: 'hsl(240, 10%, 8%)',
  foreground: '#ffffff',
  muted: '#9ca3af',
  gridColor: 'rgba(255, 255, 255, 0.05)',
};

export const darkChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: darkChartColors.foreground,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 15, 25, 0.95)',
      titleColor: darkChartColors.foreground,
      bodyColor: darkChartColors.muted,
      borderColor: darkChartColors.primary,
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
    },
  },
  scales: {
    y: {
      grid: {
        color: darkChartColors.gridColor,
        drawBorder: false,
      },
      ticks: {
        color: darkChartColors.muted,
        font: {
          size: 12,
        },
      },
    },
    x: {
      grid: {
        color: darkChartColors.gridColor,
        drawBorder: false,
      },
      ticks: {
        color: darkChartColors.muted,
        font: {
          size: 12,
        },
      },
    },
  },
};

export const chartCardWrapper = "card-elevated p-6 animate-fade-in";

export const chartHeader = (title: string, subtitle?: string) => (
  <div className="flex items-center gap-2 mb-6">
    <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
    <div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  </div>
);
