import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  

function BudgetTasks() {
  return (
    <div className='ml-64 mt-6 flex justify-evenly flex-wrap'>
<Card className='w-96'>
  <CardHeader>
    <CardTitle>My Budget</CardTitle>
    <CardDescription>budget allocation</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent><CardContent>
    <p>Card Content</p>
  </CardContent><CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
<Card className='w-96 mt-2'>
  <CardHeader>
    <CardTitle>Planned tasks</CardTitle>
    <CardDescription>budget allocation</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>

    </div>
  )
}

export default BudgetTasks