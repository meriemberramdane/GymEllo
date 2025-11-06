import React, { useContext } from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import Card from './ui/Card';
import { UserContext } from '../contexts/UserContext';
import { WeightLog } from '../types';

interface ProgressTrackerProps {
  isPreview?: boolean;
}

const MOCK_PREVIEW_DATA: WeightLog[] = [
  { date: '2023-01-01', weight: 85 },
  { date: '2023-02-01', weight: 84 },
  { date: '2023-03-01', weight: 82 },
  { date: '2023-04-01', weight: 83 },
  { date: '2023-05-01', weight: 81 },
  { date: '2023-06-01', weight: 80 },
];

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ isPreview = false }) => {
  // Fix: Consume context safely.
  const userContext = useContext(UserContext);

  // Fix: Use an empty array as a fallback if weightLog is not available.
  const data = isPreview ? MOCK_PREVIEW_DATA : userContext?.weightLog || [];
  
  const formattedData = data.map(log => ({
    name: new Date(log.date).toLocaleDateString('en-US', { month: 'short' }),
    weight: log.weight,
  }));

  const firstWeight = data.length > 0 ? data[0].weight : 0;
  const lastWeight = data.length > 0 ? data[data.length - 1].weight : 0;
  const weightChange = lastWeight - firstWeight;


  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
          <p className="label text-white font-bold">{`${label}`}</p>
          <p className="text-red-400">{`Weight: ${payload[0].value} kg`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={isPreview ? 'p-0 md:p-0' : ''}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center" style={{padding: isPreview ? '2rem' : '0' }}>
            <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400 text-sm">Weight Change</p>
                <p className={`text-3xl font-bold ${weightChange <= 0 ? 'text-green-400' : 'text-red-400'}`}>{weightChange.toFixed(1)} kg</p>
            </div>
             <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400 text-sm">Workout Streak</p>
                <p className="text-3xl font-bold text-orange-400">12 Days</p>
            </div>
             <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400 text-sm">Current Weight</p>
                <p className="text-3xl font-bold text-cyan-400">{lastWeight.toFixed(1)} kg</p>
            </div>
        </div>
      <div className="h-96 mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" domain={['dataMin - 2', 'dataMax + 2']}/>
            <Tooltip content={customTooltip} />
            <Legend wrapperStyle={{ color: '#d1d5db' }}/>
            <Line type="monotone" dataKey="weight" stroke="#ef4444" strokeWidth={2} name="Weight (kg)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ProgressTracker;