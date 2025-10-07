import React, { useState } from 'react'
import {HiOutlineMenu, HiOutlineX} from "react-icons/hi"
import SideMenu  from './SideMenu';

const Navbar = ({ activeMenu }) => {
        const [openSideMenu, setOpenSideMenu] = useState(false);
    return (
        <div className='flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30'>
            <button
                className='block lg:hidden text-black'
                onClick={() => {
                    setOpenSideMenu(!openSideMenu);
                }}
            >
                {openSideMenu ? (
                    <HiOutlineX className='text-2xl'/>
                ) : (
                    <HiOutlineMenu className='text-2xl' />
                )}
            </button>

            <h2 className='text-lg font-medium text-black'>Smart Kharch</h2>
            {/* Mobile overlay and animated slide-in panel */}
            {openSideMenu && (
                <div className='fixed top-[61px] -ml-4 bg-white'>
                    <SideMenu activeMenu = {activeMenu} />
                </div>
            )}
            {/* <div
                className={`fixed inset-0 bg-black/20 z-30 lg:hidden ${openSideMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity`}
                onClick={() => setOpenSideMenu(false)}
            />
            <div
                className={`fixed top-[61px] left-0 w-64 h-[calc(100vh-61px)] bg-white shadow-xl z-40 lg:hidden transform transition-transform duration-300 ${openSideMenu ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <SideMenu activeMenu = {activeMenu} />
            </div> */}
        </div>  
    )
}

export default Navbar