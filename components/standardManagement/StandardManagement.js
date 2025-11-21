'use client'
import React, { useState, useMemo, useEffect } from 'react';
import Layout from '../../layouts/Layout';
import StandardsClassesManagementDashboard from './dashboard';

// ==================================================================

const StandardsClassesManagement = ({ }) => {
    const [reloadKey, setReloadKey] = useState(0);

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

            </Layout>
        </>
    );
};
// ==================================================================
export default StandardsClassesManagement;
// ==================================================================