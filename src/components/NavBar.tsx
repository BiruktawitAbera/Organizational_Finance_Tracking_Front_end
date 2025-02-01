"use client"
import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMoneyBillWave, faFileInvoiceDollar, faWallet, faBuilding, faUserTie, faCog, faBars } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button 
                className="fixed top-4 left-4 z-60 p-2 bg-blue-500 text-white rounded-lg md:hidden" 
                onClick={toggleSidebar}
            >
                <FontAwesomeIcon icon={faBars} />
            </button>
            <aside className={`bg-white text-black p-4 fixed top-0 left-0 h-full z-50 w-64 border border-r-slate-500 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="container mx-auto">
                    <div className='flex items-center mb-5'>
                        <Image src="/horizon-logo.png" alt="BudgetWise-logo" width={32} height={32} />
                        <h1 className="ml-2 text-3xl font-bold">BudgetWise</h1>
                    </div>
                    <ul className="flex flex-col">
                        <li>
                            <Link href="/" className="flex items-center p-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200">
                                <FontAwesomeIcon icon={faHome} className="mr-2" style={{ width: '24px', height: '24px' }} />
                                <span className="text-sm">Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/income" className="flex items-center p-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200">
                                <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" style={{ width: '24px', height: '24px' }} />
                                <span className="text-sm">Income</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/expense" className="flex items-center p-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200">
                                <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-2" style={{ width: '24px', height: '24px' }} />
                                <span className="text-sm">Expense</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/budget" className="flex items-center p-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200">
                                <FontAwesomeIcon icon={faWallet} className="mr-2" style={{ width: '24px', height: '24px' }} />
                                <span className="text-sm">Budget</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/departments" className="flex items-center p-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200">
                                <FontAwesomeIcon icon={faBuilding} className="mr-2" style={{ width: '24px', height: '24px' }} />
                                <span className="text-sm">Departments</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/managers" className="flex items-center p-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200">
                                <FontAwesomeIcon icon={faUserTie} className="mr-2" style={{ width: '24px', height: '24px' }} />
                                <span className="text-sm">Managers</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/settings" className="flex items-center p-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200">
                                <FontAwesomeIcon icon={faCog} className="mr-2" style={{ width: '24px', height: '24px' }} />
                                <span className="text-sm">Settings</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    onClick={toggleSidebar} 
                    className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                ></div>
            )}
        </>
    );
};

export default Sidebar;
