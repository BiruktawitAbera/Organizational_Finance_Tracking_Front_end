import React from 'react'
import AnimatedCounter from './animatedcounter'
import DoughnutChart from './totalprofit'

function TotalBalance() {
  return (
    <div className='ml-2'>
    <section className='bg-white shadow-lg p-6 m-2 flex rounded-lg ml-64 mr-8' style={{ borderRadius: '20px', height: '168px' }}>
        <div className='w-32 h-32 mr-6'><DoughnutChart /></div>
        <div className='flex flex-col gap-6'>
            <h2 className='font-semibold text-[#101828] text-base'> Current Profit</h2>
            <div className="flex flex-col gap-2">
          <p className="font-medium text-[#475467] text-sm">
            Total Current Balance
          </p>

          <div className="font-bold text-[#101828] text-3xl flex-center gap-2">
            <AnimatedCounter />

          </div>
        </div>
        </div>
    </section>
    </div>
  )
}

export default TotalBalance