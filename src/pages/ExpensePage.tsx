import ExpenseDisplay from '../components/ExpenseDisplay';
import IncomeTable from '../components/table'

function expense() {
  return (
    <>
    <h1 className='text-3xl font-semibold'>Expense History</h1>
    <p className='text-base font-normal text-gray-600'>Gain insight to your finance</p>
    <ExpenseDisplay totalExpense={14000} />
    <IncomeTable />
    </>
    
  )
}

export default expense