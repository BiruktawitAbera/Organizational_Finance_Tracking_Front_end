import React from 'react';

interface ExpenseDisplayProps {
  totalExpense: number;
}


const ExpenseDisplay: React.FC<ExpenseDisplayProps> = ({ totalExpense }) => {
  return (
    <div className="w-full p-6 my-8 text-white bg-red-600 rounded-lg shadow-md">
      {/* Adjust width as needed */}
      <div className="flex flex-col justify-between md:flex-row md:items-center">
        {/* Use flexbox for layout */}
        <div className="mb-4 md:mb-0 md:mr-6">
          {/* Margin bottom for stacked layout, margin right for side-by-side */}
          <h2 className="mb-2 text-2xl font-bold">Total Income</h2>
          <p className="text-lg">Chase Growth Savings Account</p>
        </div>
        <div className="p-4 m-6 bg-red-400 rounded-md">
            <h3 className='text-sm font-medium'>Current Expense</h3>
          {/* Added background to the amount */}
          <p className="text-2xl font-semibold">
            {/* Format the income with commas */}
            ${totalExpense.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDisplay;
