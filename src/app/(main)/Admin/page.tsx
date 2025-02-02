"use client"
import ActivitiesSection from '@/components/Activities'
import BudgetTasks from '@/components/BudgetTasks'
import Header from '@/components/Header'
import NavBar from '@/components/NavBar'
import PredectionSection from '@/components/PredectionSection'
import Statistics from '@/components/statistics'
import TotalBalance from '@/components/totalbalance'
import React from 'react'
import { useState } from 'react';

function Admin() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <NavBar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className={`max-w-[2000px] mr-6 ${isOpen ? 'ml-64' : 'ml-0'}`}>
        <Header />
        <TotalBalance />
        <PredectionSection />
        <BudgetTasks />
        <Statistics />
        <ActivitiesSection />
      </div>
    </>
  )
}

export default Admin;