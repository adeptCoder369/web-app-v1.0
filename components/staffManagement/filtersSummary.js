// components/inventory/ActiveFilters.jsx
import React from 'react';
import { paymentModeIcons, categoryIcons, staffStatusIcons, commonIcons } from './icons'

const { FaTimes } = commonIcons;

const StaffFiltersSummary = ({ filters, toggleFilter, clearFilters }) => {


    // console.log('---------- filters -------->',filters);


    const getDisplayedFilters = () => {
        const allFilters = [];

        // filters.modules.forEach(module => {
        //     allFilters.push({
        //         type: 'modules',
        //         value: typeof module === 'string' ? module : module.moduleName // FIX: use string
        //     });
        // });

        // filters.modules.forEach(module => {
        //     allFilters.push({
        //         type: 'studentStauts',
        //         value: typeof module === 'string' ? module : module.moduleName // FIX: use string
        //     });
        // });

        if (filters.paymentMode) {
            allFilters.push({
                type: 'paymentMode',
                value: filters.paymentMode, // no .name, it's just a string
            });
        }


        if (filters.title) {
            allFilters.push({
                type: 'title',
                value: filters.title, // no .name, it's just a string
            });
        }
        filters.status.forEach(status => {
            allFilters.push({
                type: 'status',
                value: status
            });
        });

        return allFilters;
    };



    const a = getDisplayedFilters()

    if (getDisplayedFilters().length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2 p-4">
            <span className="text-sm font-medium text-gray-500">Active filters:</span>

            {getDisplayedFilters().map((filter, index) => {
                // console.log('filters =filter=========', filter);

                return (
                    <div
                        key={index}
                        className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm"
                    >
                        <span className="capitalize mr-1">
                            {filter.type === 'paymentMode' ? 'Mode' : filter.type === 'categories' ? 'Category' : 'Status'}:
                        </span>
                        <span className="font-medium flex items-center">
                            {filter.type === 'paymentMode' && paymentModeIcons[filter.value] && (
                            <span className="mr-1">{paymentModeIcons[filter.value]}</span>
                        )}
                            {/* {filter.type === 'categories' && categoryIcons[filter.value] && (
                            <span className="mr-1">{categoryIcons[filter.value]}</span>
                        )} */}
                            {filter.type === 'status' && staffStatusIcons[filter.value] && (
                            <span className="mr-1">{staffStatusIcons[filter.value]}</span>
                        )}
                            {filter.value}
                        </span>
                        <button
                            onClick={() => toggleFilter(filter.type, filter.value)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>

                )
            })}

            <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
                Clear all
            </button>
        </div>
    );
};

export default StaffFiltersSummary;