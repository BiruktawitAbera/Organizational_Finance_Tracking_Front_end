"use client"
import CountUp from 'react-countup';

function AnimatedCounter() {
  return (
    <div className='w-full'><CountUp duration={2} decimals={2} decimal='.' prefix='$' end={2888590}/></div>
  )
}

export default AnimatedCounter