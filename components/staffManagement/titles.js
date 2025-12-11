import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, List, Notebook } from "lucide-react";
// import ParentCreateModal from "./ParentCreateModal";
// import ParentFilterPanel from "./ParentFilterPanel";
// import ParentEditModal from "./ParentEditModal";
import { getTitle } from "../../api/title";
import { IoPeopleSharp } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import ConfirmationDialogueBox from "../ui/status/Confirmation";
import { VscSymbolClass } from "react-icons/vsc";

export default function SchoolTitleManagement({ Context, config }) {
  const [filters, setFilters] = useState({
    name: "",
    mobile: "",
    isSearch: false

  });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const [title, setTitle] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [parentToDelete, setParentToDelete] = useState(null);

  const fetchParents = async (pageNumber = 1) => {
    try {
      setLoading(true);


      const res = await getTitle(
        Context?.profileId,
        Context?.session,
        pageNumber,
        limit,
        filters
      );
      console.log(res?.data?.results);

      if (res?.data?.success) {
        setTitle(res.data.results.user_titles || []);
        setTotal(res.data.results.count || 0);
        setPage(pageNumber);
      }
    } catch (err) {
      console.log("Parents fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents(1);
  }, [
    filters?.isSearch,
    // filters?.mobile,

  ]);
  // console.log('filters++', filters);

  const openAddModal = () => {
    // setEditingParent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (parent) => {
    setEditingParent(parent);
    // setIsModalOpen(true);
  };

  const handleDelete = (parent) => {
    console.log(parent);

    // if (!window.confirm("Delete this parent?")) return;
    // setTitle(parent);
    setParentToDelete(parent)
  };

  const totalPages = Math.ceil(total / limit);
  // console.log('parents___', title);
  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const getFilterCount = () => {
    return (filters?.name ? 1 : 0) + (filters?.mobile ? 1 : 0);
  };


  const toggleFilter = (filterType, value, event) => {
    // console.log('---- values ----', filterType, value, event);

    if (event) {
      event.stopPropagation();
    }
    setFilters(prev => {

      const current = prev[filterType];
      // If current is an array (multi-select), toggle value in the array
      if (Array.isArray(current)) {
        if (current.includes(value)) {
          return { ...prev, [filterType]: current.filter(item => item !== value) };
        } else {
          return { ...prev, [filterType]: [...current, value] };
        }
      }
      // If scalar (string/date), toggle between value and empty
      return { ...prev, [filterType]: current === value ? '' : value };


    });

  };
  // console.log('lo aaya filters ___________', filters);

  return (
    <>


      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
        <div className=" mx-auto">
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* Left Section: Icon + Title */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-accent rounded-2xl flex items-center justify-center shadow-xl">
                <Notebook className="w-8 h-8 text-white" />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-accent bg-clip-text text-transparent">
                  School Title Management
                </h1>
                <p className="text-gray-600 font-medium mt-1 text-sm md:text-base">
                  Manage Title  and track performance
                </p>
              </div>
            </div>

            {/* Right Section: Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">

              {/* Filters Button */}
              <button
                onClick={toggleFilterPanel}
                className="cursor-pointer flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaFilter size={16} className="mr-2" />
                <span>Filters</span>
                {getFilterCount() > 0 && (
                  <span className="ml-2 bg-blue-500 text-white text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center">
                    {getFilterCount()}
                  </span>
                )}
              </button>

              {/* Add Parent Button */}
              <button
                onClick={openAddModal}
                className="cursor-pointer flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-accent text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Add Title</span>
              </button>

            </div>
          </div>
          {/* <ParentFilterPanel
            setFilters={setFilters}
            filters={filters}
            config={config}
            isFilterPanelOpen={isFilterPanelOpen}

            setIsFilterPanelOpen={setIsFilterPanelOpen}
            // staffStatus={staffStatus}
            // accountStatus={accountStatus}
            toggleFilter={toggleFilter}

          /> */}

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-sm font-semibold text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Users</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-400">
                      Loading…
                    </td>
                  </tr>
                ) : title.length ? (
                  title.map((item) => (
                    <tr key={item.id}>
                      {/* Name */}
                      <td className="px-6 py-3">
                        {item.name}
                      </td>

             

                      {/* Number of Users */}
                      <td className="px-6 py-3">
                        {item.number_of_users || "0"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-3 flex justify-center gap-3">
                        {item.options?.length ? (
                          item.options.map((opt, i) => {
                            let Icon;
                            let handler;
                            let styles = "";

                            switch (opt.action) {
                              // case "view":
                              //   Icon = List;
                              //   handler = () => openEditModal(item);
                              //   styles = "bg-green-100 text-green-600 hover:bg-green-200";
                              //   break;

                              case "edit":
                                Icon = Edit2;
                                handler = () => openEditModal(item);
                                styles = "bg-blue-100 text-blue-600 hover:bg-blue-200";
                                break;

                              case "delete":
                                Icon = Trash2;
                                handler = () => handleDelete(item);
                                styles = "bg-red-100 text-red-600 hover:bg-red-200";
                                break;

                              default:
                                return null;
                            }

                            return (
                              <button
                                key={i}
                                onClick={handler}
                                className={`cursor-pointer p-2 rounded ${styles}`}
                              >
                                <Icon className="w-4 h-4" />
                              </button>
                            );
                          })
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-400">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>


            </table>
          </div>

          {/* Pagination */}
          {total > 0 && (
            <div className="flex items-center gap-2 mt-4">

              {/* Prev */}
              <button
                disabled={page === 1}
                onClick={() => fetchParents(page - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              {/* Dynamic Pages */}
              <div className="flex gap-1">
                {(() => {
                  const pages = [];
                  const totalPages = Math.ceil(total / limit);

                  const add = (n) => {
                    if (!pages.includes(n)) pages.push(n);
                  };

                  // calculate window
                  const left = Math.max(1, page - 2);
                  const right = Math.min(totalPages, page + 2);

                  // always page 1
                  add(1);

                  // gap before window
                  if (left > 2) add("...");

                  // window pages
                  for (let i = left; i <= right; i++) add(i);

                  // gap after window
                  if (right < totalPages - 1) add("...");

                  // always last page
                  if (totalPages > 1) add(totalPages);

                  return pages.map((p, i) =>
                    p === "..." ? (
                      <span key={i} className="px-3 py-1 text-gray-500">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => fetchParents(p)}
                        className={`px-3 py-1 rounded ${p === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                          }`}
                      >
                        {p}
                      </button>
                    )
                  );
                })()}
              </div>


              {/* Next */}
              <button
                disabled={page >= totalPages}
                onClick={() => fetchParents(page + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Modal */}
          {/* <ParentEditModal
            updateParents={updateParents}
            open={editingParent}
            onClose={() => setEditingParent(false)}
            editingParent={editingParent}
          /> */}


          {/* <ParentCreateModal
            addParents={addParents}
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          /> */}

        </div>
      </div>





      {parentToDelete && (
        <ConfirmationDialogueBox
          title="Delete Parent?"
          description={`Are you sure you want to delete "${parentToDelete?.name}"?`}
          // onConfirm={confirmDelete}
          onCancel={() => setParentToDelete(null)}
        />
      )}
    </>
  );
}
