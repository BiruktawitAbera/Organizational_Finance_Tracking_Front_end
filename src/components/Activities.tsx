import React from 'react'

const ActivitiesSection = () => (
    <div className='ml-2 mb-12'>
    <div className="bg-white shadow-lg p-6 m-2 flex flex-col rounded-lg ml-64 mr-8" style={{ borderRadius: '20px' }}>
      <h1 className="text-2xl font-bold mb-4">Activities</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600">Name</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600">Date</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600">Action Performed</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-3 px-4 border-b border-gray-200">John Doe</td>
            <td className="py-3 px-4 border-b border-gray-200">2023-04-01</td>
            <td className="py-3 px-4 border-b border-gray-200">Logged In</td>
          </tr>
          <tr className="bg-green-100">
            <td className="py-3 px-4 border-b border-gray-200">Jane Smith</td>
            <td className="py-3 px-4 border-b border-gray-200">2023-04-01</td>
            <td className="py-3 px-4 border-b border-gray-200">Uploaded a file</td>
          </tr>
          <tr>
            <td className="py-3 px-4 border-b border-gray-200">Alice Johnson</td>
            <td className="py-3 px-4 border-b border-gray-200">2023-04-01</td>
            <td className="py-3 px-4 border-b border-gray-200">Edited profile</td>
          </tr>
          <tr className="bg-green-100">
            <td className="py-3 px-4 border-b border-gray-200">Bob Brown</td>
            <td className="py-3 px-4 border-b border-gray-200">2023-04-01</td>
            <td className="py-3 px-4 border-b border-gray-200">Changed password</td>
          </tr>
          <tr>
            <td className="py-3 px-4 border-b border-gray-200">Emma White</td>
            <td className="py-3 px-4 border-b border-gray-200">2023-04-01</td>
            <td className="py-3 px-4 border-b border-gray-200">Logged out</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  );

export default ActivitiesSection;