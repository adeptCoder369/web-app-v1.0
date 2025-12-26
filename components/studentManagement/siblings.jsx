"use client";
import React, { useEffect, useState } from "react";
import { Users, User, Phone, Home } from "lucide-react";
import { getSiblingsList } from '../../api/siblings';

export default function Siblings({ context, config }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");
  const classOptions = React.useMemo(() => {
    return (
      config?.standards?.flatMap((std) =>
        std.classes?.map((cls) => ({
          id: cls.id,
          name: cls.name,
          standardName: std.name
        }))
      ) || []
    );
  }, [config?.standards]);

  const fetchSiblings = async () => {
    try {
      setLoading(true);

      const res = await getSiblingsList(
        context?.profileId,
        context?.session,
        selectedClassId || undefined
      );
      console.log('res___', selectedClassId, res);

      setData(res?.data?.results?.siblings || []);
    } catch (e) {
      setError("Failed to load sibling data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchSiblings();
  }, [selectedClassId]);












  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin h-10 w-10 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full" />
        <p className="mt-4 text-gray-600">Loading family drama…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Siblings
            </h1>
            <p className="text-gray-600">
              Because one child per family was apparently too easy
            </p>
          </div>
        </div>

        {/* CLASS FILTER */}
        <div className="mb-8 flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-700">
            Class
          </label>

          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Classes</option>

            {classOptions.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.standardName})
              </option>
            ))}
          </select>

        </div>


        {/* LIST */}
        <div className="space-y-8">
          {data.map((group, idx) => (
            <SiblingCard key={idx} group={group} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------- SUB COMPONENTS -------------------- */

function SiblingCard({ group }) {
  const { student, parents, siblings } = group;

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
      {/* STUDENT */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar name={student?.name} />
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {student?.name}
          </h2>
          <p className="text-sm text-gray-500">
            {student?.class?.name || "No class"} • Roll {student?.roll_number || "-"}
          </p>
          {student?.registered_phone_form_sms && (
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <Phone className="w-4 h-4" />
              {student.registered_phone_form_sms}
            </p>
          )}
        </div>
      </div>

      {/* PARENTS */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Home className="w-4 h-4" />
          Parents / Guardians
        </h3>
        <div className="flex flex-wrap gap-3">
          {parents.map((p) => (
            <span
              key={p.id}
              className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
            >
              {p.name} ({p.relation})
            </span>
          ))}
        </div>
      </div>

      {/* SIBLINGS */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Siblings ({siblings.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {siblings.map((sib) => (
            <div
              key={sib.id}
              className="border rounded-2xl p-4 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <Avatar name={sib.name} small />
                <div>
                  <p className="font-medium text-gray-800">{sib.name}</p>
                  <p className="text-xs text-gray-500">
                    {sib.class?.name || "No class"} • Roll {sib.roll_number || "-"}
                  </p>
                  {sib.registered_phone_form_sms && (
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" />
                      {sib.registered_phone_form_sms}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Avatar({ name, small }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold ${small ? "w-10 h-10 text-sm" : "w-14 h-14 text-lg"
        }`}
    >
      {name?.charAt(0)?.toUpperCase() || <User />}
    </div>
  );
}
