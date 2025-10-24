
export const AddStandardModal = ({
    modalType,
    handleAddClass,
    loading,
    setShowAddModal,
    section,
    teachers
}) => {



    const isClass = modalType === "class";

    return (
        <>
            <div className="fixed inset-0   backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                <div className="bg-white border border-accent ring-2 rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Add New Standard
                    </h2>

                    <form className="space-y-4">
                        {modalType === 'standard' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Standard Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 11th Standard"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Start Session */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Session
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* End Session */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Session
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Standard Level */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Standard Level
                                    </label>
                                    <select
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Level</option>
                                        <option value="primary">Primary</option>
                                        <option value="secondary">Secondary</option>
                                        <option value="higher_secondary">Higher Secondary</option>
                                        <option value="college">College</option>
                                    </select>
                                </div>
                            </>
                        ) : (
                            <>









                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Section
                                    </label>
                                    <input
                                        value={section}
                                        id={section}
                                        type="text"
                                        placeholder="e.g., VI-E"
                                        onChange={(e) => setSection(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Class Teacher
                                    </label>
                                    <select
                                        onClick={(value) => setSelectedTeacher(value.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="Morning">Choose Teacher</option>
                                        {teachers?.map(teacher => <option value={teacher?.id}>{teacher?.name}</option>)}
                                    </select>
                                </div>

                            </>
                        )}
                    </form>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="cursor-pointer px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddClass}
                            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {!loading
                                ? `Add ${isClass ? "Class" : "Standard"}`
                                : `Saving ${isClass ? "Class" : "Standard"}...`}                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}