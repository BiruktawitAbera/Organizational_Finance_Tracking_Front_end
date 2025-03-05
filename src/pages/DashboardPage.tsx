import { Users, DollarSign, ShoppingCart, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar.tsx";
import DoughnutChart from "../components/totalprofit.tsx";
import AnimatedCounter from "../components/animatedcounter.tsx";
import { Tv, Coins } from "lucide-react";
import IncomeTable from "../components/table.tsx";
import { Line, Doughnut } from "react-chartjs-2";
import "chart.js/auto";

interface DashboardPageProps {
  role: string | null;
}

const DashboardPage = ({ role }: DashboardPageProps) => {
  return (
    <div className="font-inter">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, <span className="text-blue-500">{role?.toUpperCase()}</span>
          </h1>
          <p className="text-[#475467]">Access & manage your finance effectively</p>
        </div>
        <div className="flex items-center">
          <Bell className="w-6 h-6 mr-4 text-gray-800" />
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Current Profit Section */}
      <section className="flex p-6 mb-6 bg-white rounded-lg shadow-lg">
        <div className="w-32 h-32 mr-6">
          <DoughnutChart />
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="font-semibold text-[#101828] text-base">Current Profit</h2>
          <p className="font-medium text-[#475467] text-sm">Total Current Balance</p>
          <div className="font-bold text-[#101828] text-3xl">
            <AnimatedCounter />
          </div>
        </div>
      </section>

      {/* Prediction & Budget Allocation */}
      <section className="flex flex-col p-6 mb-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col justify-between w-full md:flex-row">
          {/* Prediction */}
          <div className="flex flex-col items-center w-full mb-4 md:w-1/2 md:mb-0">
            <div className="w-full h-48">
              <Line
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                  datasets: [
                    {
                      label: "Revenue Trend",
                      data: [65, 59, 80, 81, 56, 55, 40],
                      borderColor: "#2D5BFF",
                      backgroundColor: "rgba(75,192,192,0.2)",
                      tension: 0.4,
                    },
                  ],
                }}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
              />
            </div>
            <p className="mt-4 text-lg font-bold">Prediction</p>
          </div>

          {/* Budget Allocation */}
          <div className="flex flex-col items-center w-full md:w-1/2">
            <div className="w-full h-48">
              <Doughnut
                data={{
                  labels: ["Operations", "Marketing", "R&D"],
                  datasets: [
                    {
                      label: "Budget Allocation",
                      data: [300, 50, 100],
                      backgroundColor: ["#1E90FF", "#4682B4", "#5F9EA0"],
                      hoverOffset: 4,
                    },
                  ],
                }}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
              />
            </div>
            <p className="mt-4 text-lg font-bold">Budget Allocation</p>
          </div>
        </div>
      </section>

      {/* Role-Based Content */}
      {role === "admin" && (
        <section className="p-6 mb-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <p>Manage users, approve budgets, and view financial reports.</p>
        </section>
      )}

      {role === "manager" && (
        <section className="p-6 mb-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">Manager Dashboard</h2>
          <p>Allocate budgets, review reports, and manage department expenses.</p>
        </section>
      )}

      {role === "department_head" && (
        <section className="p-6 mb-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">Department Head Dashboard</h2>
          <p>Generate reports, submit budget requests, and monitor department spending.</p>
        </section>
      )}

      {/* Conditional Sections for Non-Admins */}
      {role !== "admin" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activities */}
          <div className="p-6 bg-white shadow-md rounded-xl">
            <h2 className="mb-4 text-lg font-bold text-gray-800">My Budget</h2>
            <div className="space-y-3">
              {[
                { icon: Tv, description: "Subscription", time: "25 left", progress: 90 },
                { icon: ShoppingCart, description: "Marketing", time: "120 left", progress: 70 },
                { icon: Coins, description: "Savings", time: "50 left", progress: 80 },
              ].map((activity, i) => (
                <div key={i} className="space-y-1 flex items-center p-5 rounded-xl bg-gray-100">
                  <activity.icon className="w-6 h-6 text-gray-700" />
                  <div className="ml-4">
                    <p className="text-sm font-semibold">{activity.description}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Financial Statistics */}
      <div className="grid grid-cols-1 gap-6 mt-8 mb-8 md:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total Revenue", value: "$45,231.89", change: "+20.1%", positive: true },
          { label: "Active Users", value: "2,338", change: "+15.3%", positive: true },
          { label: "New Orders", value: "182", change: "-3.2%", positive: false },
        ].map((stat, index) => (
          <div key={index} className="p-6 bg-white shadow-md rounded-xl">
            <h2 className="text-sm font-medium text-gray-800">{stat.label}</h2>
            <h2 className="text-2xl font-bold text-gray-800">{stat.value}</h2>
            <span className={`text-sm font-medium ${stat.positive ? "text-green-600" : "text-red-600"}`}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Activity Table */}
      <h1 className="text-xl font-bold">Activity</h1>
      <IncomeTable />
    </div>
  );
};

export default DashboardPage;
