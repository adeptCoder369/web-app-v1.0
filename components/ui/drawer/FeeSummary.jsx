import React, { useState, useEffect } from 'react';

import { FaXmark } from "react-icons/fa6";
import TooltipInfo from '../tooltip/TooltipInfo';
import FeeSection from '../../../components/FeeSummary/FeeSection';
import { useStudentFees } from '../../../controllers/fees';
import { ReceiptIndianRupee } from 'lucide-react';
import Loader from '../status/Loader';



const FeeSummaryDrawer = ({
    studentId,
    profile,
    session,
    cookyGuid,
    cookyId,
    school
}) => {
    const { getStudentFees, studetnFeesData, isLoading } = useStudentFees();


    useEffect(() => {
        getStudentFees(
            studentId,
            profile,
            session,
            cookyGuid,
            cookyId,
            school
        );
        // console.log('chala  -------------',);

    }, [studentId]);
    // console.log('changed studentId -----------', studetnFeesData, studentId);


    const [isOpen, setIsOpen] = useState(false);
    const toggleDrawer = () => setIsOpen(!isOpen);





    return (
        <div className="font-sans">
            {/* Trigger Button */}

            <TooltipInfo
                text={'View Fee Summary'}
                position={'left'}
            >


                <button
                    type="button"

                    onClick={toggleDrawer}
                    className="cursor-pointer rounded-full w-10 h-10 flex items-center justify-center bg-accent text-white shadow-lg  transition-colors"
                    aria-label="Edit Categories"
                >
                    <ReceiptIndianRupee size={16} />
                </button>
            </TooltipInfo>

            {/* Slide Drawer */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={toggleDrawer}
            />

            <div
                className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-gray-50 shadow transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                    <div className="flex justify-between items-center px-6 py-4">
                        <h1 className="text-xl font-semibold text-gray-800">Fee Summary</h1>
                        <div className="flex items-center gap-4">

                            <button
                                type="button" // <-- Add this!

                                onClick={toggleDrawer}
                                className="rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                                aria-label="Close"
                            >
                                <FaXmark size={18} />
                            </button>
                        </div>
                    </div>

                </div>
                {

                    isLoading ? <FeeSection data={studetnFeesData} />
                        : <>
                            <div className='bg-accent'>
                                <Loader />
                                {/* <h1 className='text-acent'>Loading...</h1> */}
                            </div>
                        </>}
            </div>
        </div>
    );
};

export default FeeSummaryDrawer;