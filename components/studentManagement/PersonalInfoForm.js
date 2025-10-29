import React, { useState } from 'react';
import { User, Globe, Heart, Activity, ClipboardList, Baby, Droplet, Accessibility, Smile } from 'lucide-react';
import { FaHome, FaLanguage, FaRunning, FaHeartBroken, FaBookOpen } from 'react-icons/fa';

const PersonalDetailsForm = ({
  setFormData,
  formData,
  houses,
  feeCategories,
  categories,
  religions,
  renewalStatus,
  nationality,
  bloodGroups
}) => {
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.house) newErrors.house = 'House is required';
    if (!formData.dateOfAdmission) newErrors.dateOfAdmission = 'Date of Admission is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      console.log('Personal Details Submitted:', formData);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-4"
      >
        {/* House */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">House</label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaHome className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.house || ''}
              onChange={(e) => handleChange('house', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
              <option value="">Select House</option>
              {houses?.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
        </div>

        {/* Student Fee Category */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Student Fee Category</label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ClipboardList className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.feeCategory || ''}
              onChange={(e) => handleChange('feeCategory', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
              <option value="">Select Fee Category</option>
              {feeCategories?.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
        </div>

        {/* Renewal Status */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Renewal Status</label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Heart className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.renewalStatus || ''}
              onChange={(e) => handleChange('renewalStatus', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
              <option value="">Select Status</option>
              {renewalStatus?.map(status => (
                <option value={status}>{status}</option>

              ))}
            </select>
          </div>
        </div>

        {/* Nationality */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Nationality</label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.nationality || ''}
              onChange={(e) => handleChange('nationality', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
              <option value="">Select nationality</option>
              {nationality?.map(nationality => (
                <option value={nationality}>{nationality}</option>

              ))}
            </select>
          </div>
        </div>

        {/* Date of Admission */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Date of Admission</label>
          <div className="mt-1 relative">
            <input
              type="date"
              value={formData.dateOfAdmission || ''}
              onChange={(e) => handleChange('dateOfAdmission', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            />
          </div>
        </div>

        {/* Category */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <div className="mt-1 relative">
            <select
              value={formData.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
              <option value="">Select Category</option>
              {categories?.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* Religion */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Religion</label>
          <div className="mt-1 relative">
            <select
              value={formData.religion || ''}
              onChange={(e) => handleChange('religion', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
              <option value="">Select Religion</option>
              {religions?.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Mother Tongue */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Mother Tongue</label>
          <div className="mt-1 relative">
            <FaLanguage className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              value={formData.motherTongue || ''}
              onChange={(e) => handleChange('motherTongue', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
              <option value="">Select language</option>
              {religions?.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Below Poverty Line */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Below Poverty Line</label>
          <div className="mt-1 relative">
            <select
              value={formData.bpl || ''}
              onChange={(e) => handleChange('bpl', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        {/* Blood Group */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Blood Group</label>
          <div className="mt-1 relative">
            <Droplet className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              value={formData.bloodGroup || ''}
              onChange={(e) => handleChange('bloodGroup', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
              <option value="">Select blood group</option>
              {bloodGroups?.map(b => (
                <option value={b}>{b}</option>

              ))}
            </select>
          </div>
        </div>

        {/* Height & Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
          <input
            type="number"
            value={formData.height || ''}
            onChange={(e) => handleChange('height', e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
          <input
            type="number"
            value={formData.weight || ''}
            onChange={(e) => handleChange('weight', e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>

        {/* Vision */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Vision (Left)</label>
          <input
            type="text"
            value={formData.visionLeft || ''}
            onChange={(e) => handleChange('visionLeft', e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Vision (Right)</label>
          <input
            type="text"
            value={formData.visionRight || ''}
            onChange={(e) => handleChange('visionRight', e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>

        {/* Dental Hygiene */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Dental Hygiene</label>
                   <div className="relative">

          <Smile className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={formData.dentalHygiene || ''}
            onChange={(e) => handleChange('dentalHygiene', e.target.value)}
            placeholder="Good / Poor"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
        </div>
        </div>

        {/* Identification Mark */}
        <div className="relative sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Identification Mark</label>
          <input
            type="text"
            value={formData.identificationMark || ''}
            onChange={(e) => handleChange('identificationMark', e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            placeholder="Scar on left arm, mole, etc."
          />
        </div>

        {/* Physically Handicapped, Serious Ailment, Only Child */}
        {[
          { field: 'physicallyHandicapped', label: 'Physically Handicapped' },
          { field: 'seriousAilment', label: 'Serious Ailment' },
          { field: 'onlyChild', label: 'Only Child' },
        ].map((item) => (
          <div className="relative" key={item.field}>
            <label className="block text-sm font-medium text-gray-700">{item.label}</label>
            <select
              value={formData[item.field] || ''}
              onChange={(e) => handleChange(item.field, e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        ))}

        {/* Sports & Hobbies */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Favourite Sports</label>
          <div className="relative">

            <FaRunning className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.favouriteSports || ''}
              onChange={(e) => handleChange('favouriteSports', e.target.value)}
              placeholder="Cricket, Football..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide">
            Hobbies
          </label>
          <div className="relative">
            <FaBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.hobbies || ''}
              onChange={(e) => handleChange('hobbies', e.target.value)}
              placeholder="Reading, Music..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
        </div>

      </form>
    </div>
  );
};

export default PersonalDetailsForm;
