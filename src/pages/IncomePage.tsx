import IncomeDisplay from '../components/Income-Expense'
import IncomeTable from '../components/table'

function income() {
  return (
    <>
    <h1 className='text-3xl font-semibold'>Income History</h1>
    <p className='text-base font-normal text-gray-600'>Gain insight to your finance</p>
    <IncomeDisplay totalIncome={20000}/>
    <IncomeTable />
    </>
  )
}

export default income