import React, { useState } from 'react';
import { Home, Edit2, Trash2, Plus, X, Save, Users, Trophy, Shield, Crown, Flame, Zap } from 'lucide-react';
import HouseCreate from './houseCreateForm';

const HouseManagement = ({ houses }) => {
  // const [houses, setHouses] = useState([
  //   {
  //     id: 1,
  //     name: 'Phoenix House',
  //     color: '#EF4444',
  //     captain: 'Sarah Johnson',
  //     viceCaptain: 'Mike Chen',
  //     members: 125,
  //     points: 450,
  //     icon: 'flame',
  //     motto: 'Rise from the Ashes'
  //   },
  //   {
  //     id: 2,
  //     name: 'Dragon House',
  //     color: '#10B981',
  //     captain: 'Alex Kumar',
  //     viceCaptain: 'Emma Wilson',
  //     members: 130,
  //     points: 425,
  //     icon: 'zap',
  //     motto: 'Strength and Honor'
  //   },
  //   {
  //     id: 3,
  //     name: 'Griffin House',
  //     color: '#3B82F6',
  //     captain: 'James Smith',
  //     viceCaptain: 'Lisa Brown',
  //     members: 120,
  //     points: 480,
  //     icon: 'crown',
  //     motto: 'Courage Above All'
  //   },
  //   {
  //     id: 4,
  //     name: 'Titan House',
  //     color: '#F59E0B',
  //     captain: 'Maya Patel',
  //     viceCaptain: 'Tom Rodriguez',
  //     members: 128,
  //     points: 395,
  //     icon: 'shield',
  //     motto: 'Unity is Power'
  //   },
  // ]);




  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    captain: '',
    viceCaptain: '',
    members: 0,
    points: 0,
    icon: 'shield',
    motto: ''
  });

  const iconOptions = [
    { value: 'flame', icon: Flame, label: 'Flame' },
    { value: 'zap', icon: Zap, label: 'Lightning' },
    { value: 'crown', icon: Crown, label: 'Crown' },
    { value: 'shield', icon: Shield, label: 'Shield' },
  ];

  const getIcon = (iconName) => {
    const iconObj = iconOptions.find(opt => opt.value === iconName);
    return iconObj ? iconObj.icon : Shield;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'members' || name === 'points' ? Number(value) : value
    }));
  };

  const openAddModal = () => {
    setEditingHouse(null);
    setFormData({
      name: '',
      color: '#3B82F6',
      captain: '',
      viceCaptain: '',
      members: 0,
      points: 0,
      icon: 'shield',
      motto: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (house) => {
    setEditingHouse(house);
    setFormData(house);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingHouse) {
      setHouses(houses.map(h => h.id === editingHouse.id ? { ...formData, id: h.id } : h));
    } else {
      setHouses([...houses, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this house?')) {
      setHouses(houses.filter(h => h.id !== id));
    }
  };

  const sortedHouses = [...houses].sort((a, b) => b.points - a.points);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-accent rounded-2xl flex items-center justify-center shadow-xl">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-accent bg-clip-text text-transparent">
                  House Management
                </h1>
                <p className="text-gray-600 font-medium mt-1">Manage school houses and track performance</p>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="cursor-pointer flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-accent text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span>Add House</span>
            </button>
          </div>
        </div>


        {/* Leaderboard Banner */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-black">Current Leader</h3>
                <p className="text-white/90 font-medium">House Championship 2025</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black">{sortedHouses[0]?.name}</div>
              <div className="text-xl font-bold text-white/90">{sortedHouses[0]?.points} Points</div>
            </div>
          </div>
        </div>


{/* Houses Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
  {sortedHouses.map((house, index) => {
    const IconComponent = getIcon(house.icon);
    const totalMembers =
      (house.student_count?.FEMALE || 0) + (house.student_count?.MALE || 0);

    return (
      <div
        key={house.id}
        className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
      >
        {/* Rank Badge */}
        {index === 0 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Crown className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        {/* Header */}
        <div
          className="h-32 relative overflow-hidden"
          style={{ backgroundColor: house.color }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />

          {/* Icon / Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 overflow-hidden">
              {house.logo_url ? (
                <img
                  src={house.logo_url}
                  alt="House Logo"
                  className="w-12 h-12 object-contain rounded-lg"
                />
              ) : (
                <IconComponent className="w-12 h-12 text-white opacity-90" />
              )}
            </div>
          </div>

          {/* Rank Number */}
          <div className="absolute top-3 left-3">
            <div className="w-8 h-8 bg-accent/30 backdrop-blur-sm rounded-lg flex items-center justify-center text-white font-extrabold text-sm shadow">
              #{index + 1}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
            {house.name}
          </h3>
          <p className="text-sm text-gray-500 italic mb-4 line-clamp-1">
            “{house.motto || 'Motto not available'}”
          </p>

          {/* Stats */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-gray-700">
              <span className="text-sm font-medium">Points</span>
              <span className="text-lg font-bold">{house.points}</span>
            </div>
            <div className="flex items-center justify-between text-gray-700">
              <span className="text-sm font-medium flex items-center gap-1">
                <Users className="w-4 h-4" /> Members
              </span>
              <span className="text-base font-semibold">{totalMembers}</span>
            </div>
          </div>

          {/* Leadership */}
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">
                  CAPTAIN
                </p>
                <p className="font-bold text-gray-900 truncate">
                  {house.captain || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">
                  VICE CAPTAIN
                </p>
                <p className="font-bold text-gray-900 truncate">
                  {house.viceCaptain || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => openEditModal(house)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(house.id)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  })}
</div>

      </div>

      <HouseCreate
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default HouseManagement;