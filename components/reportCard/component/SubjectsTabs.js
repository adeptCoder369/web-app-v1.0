// components/SubjectsTabs.jsx
import React from 'react';
import {
    BookOpen, Building2, Languages, Truck,
    Home, Archive, Package, UserCheck, CreditCard,
    Library, User, Building, Globe, ShoppingCart, BadgePlus, List,
    LayoutDashboard
} from 'lucide-react';

const SubjectsTabs = ({ setActiveTab, activeTab, subjects }) => {
    // Group subjects by code
    const groupedSubjects = subjects?.reduce((acc, subject) => {
        if (subject.code) {
            if (!acc[subject.code]) acc[subject.code] = [];
            acc[subject.code].push(subject);
        }
        return acc;
    }, {});

    const subjectKeys = Object.keys(groupedSubjects || {});

    return (
        <div className="bg-white rounded-lg shadow-sm mb-6 sm:mb-8 border border-gray-200 w-340 overflow-x-auto">
            <div className="overflow-x-auto whitespace-nowrap p-2 scrollbar-hide">
                {subjectKeys.length > 0 && (
                    <div className="flex space-x-2">
                        {subjectKeys.map((subjectCode) => (
                            <button
                                key={subjectCode}
                                onClick={() => setActiveTab(subjectCode)}
                                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 ease-in-out flex-shrink-0
                  ${activeTab === subjectCode
                                        ? 'bg-indigo-500 text-white shadow'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <span>{subjectCode}</span>
                                <span className="bg-white text-indigo-500 rounded-full px-2 py-0.5 text-xs font-bold">
                                    {groupedSubjects[subjectCode].length}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectsTabs;

// Custom scrollbar-hide utility class for Tailwind CSS
// This is not a standard Tailwind class. You would need to add it to your CSS file or a plugin.
// @layer utilities {
//   .scrollbar-hide::-webkit-scrollbar {
//     display: none;
//   }
//   .scrollbar-hide {
//     -ms-overflow-style: none; /* IE and Edge */
//     scrollbar-width: none; /* Firefox */
//   }
// }