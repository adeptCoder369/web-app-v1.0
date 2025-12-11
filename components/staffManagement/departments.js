import React, { useState, useEffect } from "react";
import { Edit2, Trash2, List, Plus } from "lucide-react";
import { FaFilter } from "react-icons/fa";
import { VscSymbolClass } from "react-icons/vsc";
import { getDepartments, addDepartments ,editDepartments} from "../../api/departments";
import DepartmentCreateModal from "./DepartmentCreateModal";
import DepartmentEditModal from "./DepartmentEditModal";
import ConfirmationDialogueBox from "../ui/status/Confirmation";

export default function DepartmentManagement({ Context, config }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingDepartment, setIsEditingDepartment] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  const fetchDepartments = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await getDepartments(
        Context?.profileId,
        Context?.session
      );

      if (res?.data?.success) {
        setDepartments(res.data.results.departments || []);
        setTotal(res.data.results.count || 0);
        setPage(pageNumber);
      }
    } catch (err) {
      console.error("Department fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments(1);
  }, []);

  const handleDelete = (department) => {
    setDepartmentToDelete(department);
  };

  const totalPages = Math.ceil(total / limit);




  const openAddModal = () => {
    // setEditingParent(null);
    setIsModalOpen(true);
  };



  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
        <div className=" mx-auto">

          {/* HEADER */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-accent rounded-2xl flex items-center justify-center shadow-xl">
                <VscSymbolClass className="w-8 h-8 text-white" />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-accent bg-clip-text text-transparent">
                  Department Management
                </h1>
                <p className="text-gray-600 font-medium mt-1">
                  Manage departments and products
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="cursor-pointer flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FaFilter size={16} className="mr-2" />
                <span>Filters</span>
              </button>

              <button
                onClick={openAddModal}

                className="cursor-pointer flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-accent text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Plus className="w-5 h-5" />
                <span>Add Department</span>
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-sm font-semibold text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Products</th>
                  <th className="px-6 py-3 text-left">Designations</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-500"
                    >
                      Loading departments...
                    </td>
                  </tr>
                ) : departments.length ? (
                  departments.map((d) => (
                    <tr key={d.id}>
                      <td className="px-6 py-3">{d.name}</td>

                      <td className="px-6 py-3">{d.description || "—"}</td>

                      <td className="px-6 py-3">
                        <div className="flex flex-wrap gap-2">
                          {d.products?.map((p) => (
                            <span
                              key={p.id}
                              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
                            >
                              {p.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-3">
                        {d.number_of_designations || 0}
                      </td>

                      <td className="px-6 py-3">
                        {d.is_disabled === "0" ? (
                          <span className="text-green-600 font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">
                            Disabled
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-3 flex justify-center gap-3">
                        {d.options?.map((opt, i) => {
                          let Icon = List;
                          let handler = () => { };
                          let styles = "";

                          switch (opt.action) {
                            case "view":
                              handler = () => console.log("View", d);
                              styles =
                                "bg-green-100 text-green-600 hover:bg-green-200";
                              break;

                            case "edit":
                              Icon = Edit2;
                              handler = () => setIsEditingDepartment(d);
                              styles =
                                "bg-blue-100 text-blue-600 hover:bg-blue-200";
                              break;

                            case "delete":
                              Icon = Trash2;
                              handler = () => handleDelete(d);
                              styles =
                                "bg-red-100 text-red-600 hover:bg-red-200";
                              break;
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
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-400"
                    >
                      No departments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {total > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <button
                disabled={page === 1}
                onClick={() => fetchDepartments(page - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-sm">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => fetchDepartments(page + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}


          <DepartmentEditModal
            onUpdate={editDepartments}
            editingDept={isEditingDepartment}
            context={Context}
            open={isEditingDepartment}
            products={config?.products}
            onClose={() => setIsModalOpen(false)}
          />

          <DepartmentCreateModal
            onCreate={addDepartments}
            context={Context}
            open={isModalOpen}
            products={config?.products}
            onClose={() => setIsModalOpen(false)}
          />


        </div>
      </div>

      {/* DELETE CONFIRMATION */}
      {departmentToDelete && (
        <ConfirmationDialogueBox
          title="Delete Department?"
          description={`Are you sure you want to delete "${departmentToDelete?.name}"?`}
          onCancel={() => setDepartmentToDelete(null)}
        />
      )}
    </>
  );
}
