import React from 'react';
import AdminLayout from "@/Layouts/AdminLayout.jsx";
import { Button, Space, DatePicker, version } from 'antd';

function Dashboard({ auth }) {
    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Page</h2>}
        >
            <h3 className="text-lg mb-3">Dashboard</h3>
        </AdminLayout>
    );
}

export default Dashboard;