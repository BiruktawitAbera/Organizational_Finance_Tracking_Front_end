import { TrendingUp, Users, Target } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Analytics</h1>
      
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white shadow-sm rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-purple-50">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">Growth</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">245%</p>
          <p className="text-sm text-gray-600">Compared to last month</p>
        </div>

        <div className="p-6 bg-white shadow-sm rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-blue-50">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Users</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">1,234</p>
          <p className="text-sm text-gray-600">Active users this week</p>
        </div>

        <div className="p-6 bg-white shadow-sm rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-green-50">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Conversion</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">3.2%</p>
          <p className="text-sm text-gray-600">Current conversion rate</p>
        </div>
      </div>

      <div className="p-6 mb-6 bg-white shadow-sm rounded-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Performance Overview</h2>
        <div className="space-y-4">
          {['Page Views', 'Bounce Rate', 'Session Duration'].map((metric, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-gray-600">{metric}</span>
              <div className="w-2/3">
                <div className="h-2 bg-gray-100 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full" 
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}