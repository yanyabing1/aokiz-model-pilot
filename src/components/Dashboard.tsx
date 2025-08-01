'use client';

import { StatCard } from './StatCard';
import { Chart } from './Chart';
import { useState } from 'react';

export default function Dashboard() {
  const [activityTimeRange, setActivityTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [siteTimeRange, setSiteTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const statsData = [
    {
      title: '活动数',
      value: '333',
      icon: 'fa-calendar-alt',
      iconColor: 'primary',
      trend: { value: '12.5%', direction: 'up', color: 'secondary' }
    },
    {
      title: '事项数',
      value: '11,233,333',
      icon: 'fa-tasks',
      iconColor: 'secondary',
      trend: { value: '8.3%', direction: 'up', color: 'secondary' }
    },
    {
      title: '资源数',
      value: '3,333',
      icon: 'fa-database',
      iconColor: 'warning',
      trend: { value: '2.1%', direction: 'down', color: 'danger' }
    },
    {
      title: '成员数',
      value: '3,333',
      icon: 'fa-users',
      iconColor: 'info',
      trend: { value: '15.7%', direction: 'up', color: 'secondary' }
    }
  ];

  const siteStatsData = [
    {
      title: '站点数',
      value: '333',
      icon: 'fa-globe',
      iconColor: 'info',
      trend: { value: '5.2%', direction: 'up', color: 'secondary' }
    },
    {
      title: '页面数',
      value: '1,333',
      icon: 'fa-file-alt',
      iconColor: 'primary',
      trend: { value: '8.7%', direction: 'up', color: 'secondary' }
    },
    {
      title: '站点PV',
      value: '31,233,333',
      icon: 'fa-chart-line',
      iconColor: 'warning',
      trend: { value: '15.3%', direction: 'up', color: 'secondary' }
    },
    {
      title: '站点UV',
      value: '11,233,333',
      icon: 'fa-user-friends',
      iconColor: 'secondary',
      trend: { value: '3.2%', direction: 'down', color: 'danger' }
    }
  ];

  const activityChartData = {
    categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    data: [
      { name: '活动数', type: 'line' as const, data: [120, 132, 101, 134, 90, 230, 210], color: '#1890ff' },
      { name: 'UV', type: 'line' as const, data: [220, 182, 191, 234, 290, 330, 310], color: '#00cccc' }
    ]
  };

  const siteChartData = {
    categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    data: [
      { name: 'PV', type: 'line' as const, data: [1500, 2100, 1800, 2400, 2300, 3100, 2800], color: '#91d5ff' },
      { name: 'UV', type: 'line' as const, data: [800, 1000, 900, 1200, 1100, 1500, 1300], color: '#00cccc' }
    ]
  };

  return (
    <div className="bg-gray-50 font-inter text-gray-800">
      <div className="container mx-auto px-4 py-6">
        <main>
        {/* 用户欢迎信息 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">管理控制台</h1>
            <p className="text-gray-600">Hi, GOGO 欢迎回来!</p>
          </div>
        </div>

        {/* 功能按钮区 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
              <i className="fas fa-plus mr-2"></i>
              创建活动
            </button>
            <button className="bg-white border border-gray-200 hover:border-primary text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors">
              <i className="fas fa-plus mr-2"></i>
              创建站点
            </button>
            <button className="bg-white border border-gray-200 hover:border-primary text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors">
              <i className="fas fa-list mr-2"></i>
              我的站点
            </button>
            <button className="bg-white border border-gray-200 hover:border-primary text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors">
              <i className="fas fa-calendar-alt mr-2"></i>
              我的活动
            </button>
          </div>
        </div>

        {/* 统计数据卡片区 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Chart
            id="activityChart"
            title="活动数据"
            data={activityChartData.data}
            categories={activityChartData.categories}
            timeRange={activityTimeRange}
            onTimeRangeChange={setActivityTimeRange}
          />
          <Chart
            id="siteChart"
            title="站点数据"
            data={siteChartData.data}
            categories={siteChartData.categories}
            timeRange={siteTimeRange}
            onTimeRangeChange={setSiteTimeRange}
          />
        </div>

        {/* 第二行统计数据卡片区 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {siteStatsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </main>
    </div>
  );
}