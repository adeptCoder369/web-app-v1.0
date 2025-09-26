'use client'
import React, { useState, useEffect } from 'react';
import Layout from '../../../../../../layouts/Layout';
// import EditableTable from '../../../../../components/ui/tables/EditableFilterableTable';
import EditableTableWithIcons from '../../../../../../components/ui/tables/EditableTableWithIcons';

const OnlineClasses = () => {

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
];

const data = [
  { name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { name: "Bob Smith", email: "bob@example.com", role: "User" },
  { name: "Charlie Lee", email: "charlie@example.com", role: "Editor" },
];

  return (
    <Layout
    // dashboardData={dashboardData?.results}
    >

      <EditableTableWithIcons data={data} columns={columns} />
    </Layout>
  );
};

export default OnlineClasses;
