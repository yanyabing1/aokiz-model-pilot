'use client';

import { useEffect, useRef } from 'react';

interface ChartProps {
  id: string;
  title: string;
  data: {
    name: string;
    type: 'line' | 'bar';
    data: number[];
    color: string;
  }[];
  categories: string[];
  timeRange: 'week' | 'month' | 'year';
  onTimeRangeChange: (range: 'week' | 'month' | 'year') => void;
}

export function Chart({ title, data, categories, timeRange, onTimeRangeChange }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initChart = async () => {
      const echarts = await import('echarts');
      if (chartRef.current) {
        chartInstanceRef.current = echarts.init(chartRef.current);
        
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: data.map(item => item.name),
            top: 0
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: categories,
            axisLine: {
              lineStyle: {
                color: '#f0f0f0'
              }
            },
            axisTick: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: '#f0f0f0'
              }
            }
          },
          series: data.map(item => ({
            name: item.name,
            type: item.type,
            data: item.data,
            lineStyle: {
              color: item.color
            },
            itemStyle: {
              color: item.color
            },
            smooth: true
          }))
        };
        
        chartInstanceRef.current.setOption(option);
      }
    };

    initChart();

    const handleResize = () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
      }
    };
  }, [data, categories]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <div className="flex space-x-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range === 'week' ? '周' : range === 'month' ? '月' : '年'}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartRef} className="w-full h-[300px]"></div>
    </div>
  );
}