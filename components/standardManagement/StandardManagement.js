'use client'
import React, { useState, useMemo, useEffect } from 'react';
import {
    Users,
    Plus,
    Edit2,
    Trash2,
    Search,
    Filter,
    MoreVertical,
    BookOpen,
    GraduationCap,
    ChevronDown,
    ChevronRight,
    UserPlus,
    Settings,
    Download,
    Upload,
    Eye,
    PieChart,
    BarChart3,
    School,
    Mars,
    Venus
} from 'lucide-react';
import Layout from '../../layouts/Layout';
import { getSessionCache } from '../../utils/sessionCache';
import StudentsModal from '../../components/ui/tables/modernTable/component/StudentsModal';
import { FaDownload, FaFileCsv, FaFileExcel } from 'react-icons/fa';
import { addClass, editClass } from '../../api/classes';
import TooltipInfo from '../ui/tooltip/TooltipInfo';
import { Breadcrumbs } from '../ui/Breadcrumb/breadcrumb';
import StandardsClassesManagementDashboard from './dashboard';


// ==================================================================


const StandardsClassesManagement = ({ }) => {
    const [reloadKey, setReloadKey] = useState(0);

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const [selectedStandard, setSelectedStandard] = useState('all');
    const [selectedStandardId, setSelectedStandardId] = useState('all');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [expandedStandards, setExpandedStandards] = useState(new Set([]));
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [modalType, setModalType] = useState('standard'); // 'standard' or 'class'
    const [selectedItem, setSelectedItem] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'






    // ==================================================================
    return (
        <>
            <Layout
                stateChanged={reloadKey}
            // reloadKey={reloadKey}
            >
                <StandardsClassesManagementDashboard 
                setReloadKey={setReloadKey}
                />







                {
                    showModal ? (
                        <StudentsModal
                            selectedData={selectedClass}
                            onClose={() => setShowModal(false)}
                        />
                    ) : null
                }


            </Layout>
        </>
    );
};
// ==================================================================
export default StandardsClassesManagement;
// ==================================================================