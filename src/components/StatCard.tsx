export interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
    color: string;
  };
  period?: string;
}

export function StatCard({ title, value, icon, iconColor, trend, period = '较上月' }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-gray-600 text-sm font-medium">{title}</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          iconColor === 'primary' ? 'bg-primary/10 text-primary' :
          iconColor === 'secondary' ? 'bg-secondary/10 text-secondary' :
          iconColor === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
          iconColor === 'info' ? 'bg-blue-500/10 text-blue-500' :
          iconColor === 'danger' ? 'bg-red-500/10 text-red-500' :
          'bg-gray-500/10 text-gray-500'
        }`}>
          <i className={`fas ${icon} text-lg`}></i>
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`${
            trend.color === 'primary' ? 'text-primary' :
            trend.color === 'secondary' ? 'text-secondary' :
            trend.color === 'warning' ? 'text-yellow-500' :
            trend.color === 'info' ? 'text-blue-500' :
            trend.color === 'danger' ? 'text-red-500' :
            'text-gray-500'
          } flex items-center`}>
            <i className={`fas fa-arrow-${trend.direction} mr-1`}></i>
            {trend.value}
          </span>
          <span className="text-gray-500 ml-2">{period}</span>
        </div>
      )}
    </div>
  );
}