import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, List } from "lucide-react";
import ParentCreateModal from "./ParentCreateModal";
import ParentEditModal from "./ParentEditModal";
import { getParentsList, addParents, updateParents } from "../../api/parents";

export default function ParentManagement({ Context }) {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);

  const fetchParents = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const offset = (pageNumber - 1) * limit;

      const res = await getParentsList(
        Context?.profileId,
        Context?.session,
        pageNumber,
        limit
      );

      if (res?.data?.success) {
        setParents(res.data.results.student_parents || []);
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
  }, []);

  const openAddModal = () => {
    // setEditingParent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (parent) => {
    setEditingParent(parent);
    // setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this parent?")) return;
    setParents((prev) => prev.filter((p) => p.id !== id));
  };

  const totalPages = Math.ceil(total / limit);
  // console.log('parents___', parents);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Parent Management</h1>

        <button
          onClick={openAddModal}
          className="cursor-pointer flex items-center space-x-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Parent</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Gender</th>
              <th className="px-6 py-3 text-left">Phones</th>
              <th className="px-6 py-3 text-left">Children</th>
              <th className="px-6 py-3 text-left">Platform ID</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-sm">
            {loading ? (
              <tr>

                <td colSpan="6" className="text-center py-6 text-gray-400">
                  <div className="flex justify-center items-center py-12">
                    <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-2">
                      {/* Note: Replaced static image with an illustrative loading icon for better UX */}
                      <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-gray-700 text-sm font-medium">Loading Parent Data...</span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : parents.length ? (
              parents.map((p) => {
                // console.log('p_______________', p?.options);

                return (
                  <tr key={p.id}>
                    <td className="px-6 py-3">{p.name}</td>
                    <td className="px-6 py-3">{p.gender}</td>
                    <td className="px-6 py-3">
                      {/* {p.calling_numbers?.join(", ") || "—"} */}
                      {p.phone || "—"}
                    </td>
                    <td className="px-6 py-3">
                      {p.students?.length ? (
                        <div className="flex flex-col gap-2">
                          {p.students.map(s => (
                            <div key={s.id} className="flex items-center gap-3">

                              {/* Student Image */}
                              <img
                                src={
                                  s.image_url && s.image_url.trim() !== ""
                                    ? s.image_url
                                    : "/placeholder-student.png"
                                }
                                alt={s.name}
                                className="w-10 h-10 rounded-full object-cover border"
                                onError={(e) => {
                                  e.target.src = "/placeholder-student.png"
                                }}
                              />

                              {/* Student Info */}
                              <div className="flex flex-col leading-tight">
                                <span className="font-medium">{s.name}</span>
                                <span className="text-sm text-gray-600">
                                  {s.class}
                                  {s.roll_number ? ` | Roll ${s.roll_number}` : ""}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {s.relation_with_parent}
                                </span>
                              </div>

                            </div>
                          ))}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="px-6 py-3">{p.platform_id || "—"}</td>

                    <td className="px-6 py-3 flex justify-center gap-3">
                      {p.options?.length > 0 ? (
                        p?.options?.map((opt, i) => {
                          let Icon;
                          let handler;
                          let styles = "";

                          switch (opt.action) {
                            case "view":
                              Icon = List;
                              handler = () => openEditModal(p);
                              styles = "bg-green-100 text-green-600 hover:bg-green-200";
                              break;

                            case "edit":
                              Icon = Edit2;
                              handler = () => openEditModal(p);
                              styles = "bg-blue-100 text-blue-600 hover:bg-blue-200";
                              break;

                            case "delete":
                              Icon = Trash2;
                              handler = () => handleDelete(p.id);
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
                )
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No parents found
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
      <ParentEditModal
        updateParents={updateParents}
        open={editingParent}
        onClose={() => setEditingParent(false)}
        editingParent={editingParent}
      />


      <ParentCreateModal
        addParents={addParents}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      // editingParent={editingParent}
      />

    </div>
  );
}
