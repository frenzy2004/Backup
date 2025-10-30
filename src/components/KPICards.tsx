import React from 'react';
import { Star, TrendingUp, DollarSign, Users, Target } from 'lucide-react';

interface KPICardsProps {
  kpis: {
    avgRating: number;
    monthlyDemand: number;
    rentSensitivity: number;
    competitorCount: number;
    revenuePotential: number;
  };
}

const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  const cards = [
    {
      title: 'Revenue Potential',
      value: (kpis.revenuePotential / 1000).toFixed(0),
      unit: 'K RM',
      icon: Target,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      valueColor: 'text-foreground',
      glowColor: 'hover:shadow-primary/20',
    },
    {
      title: 'Competitor Count',
      value: kpis.competitorCount.toString(),
      unit: 'nearby',
      icon: Users,
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      valueColor: 'text-foreground',
      glowColor: 'hover:shadow-destructive/20',
    },
    {
      title: 'Avg Rating',
      value: kpis.avgRating.toFixed(1),
      unit: '/ 5.0',
      icon: Star,
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      valueColor: 'text-foreground',
      glowColor: 'hover:shadow-warning/20',
    },
    {
      title: 'Est. Monthly Demand',
      value: (kpis.monthlyDemand / 1000).toFixed(1),
      unit: 'K visits',
      icon: TrendingUp,
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      valueColor: 'text-foreground',
      glowColor: 'hover:shadow-success/20',
    },
    {
      title: 'Rent Sensitivity',
      value: kpis.rentSensitivity.toString(),
      unit: '/ 100',
      icon: DollarSign,
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
      valueColor: 'text-foreground',
      glowColor: 'hover:shadow-accent/20',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 bg-primary rounded-full"></div>
        <h3 className="text-lg font-semibold text-foreground">Key Performance Indicators</h3>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card-elevated p-5 transition-all duration-300 hover:scale-[1.02] ${card.glowColor} hover:shadow-xl group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${card.iconBg} rounded-lg group-hover:scale-110 transition-transform`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>
            <div className="space-y-2">
              <div className={`text-3xl font-bold ${card.valueColor} leading-none`}>
                {card.value}
                <span className="text-base font-medium text-muted-foreground ml-1">{card.unit}</span>
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{card.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPICards;