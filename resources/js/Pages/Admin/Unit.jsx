import React, {useEffect, useState} from 'react';
import AdminLayout from "@/Layouts/AdminLayout.jsx";
import {CopyOutlined} from '@ant-design/icons';
import {Table, Button, InputNumber, Select, notification} from 'antd';

const columns = [
    {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Book',
        dataIndex: 'book_number',
        key: 'book_number',
    },
    {
        title: 'Units',
        dataIndex: 'units',
        key: 'units',
    }
];

function Unit({auth, books}) {
    const [unitNumber, setUnitNumber] = useState(null)
    const [bookId, setBookId] = useState(null)
    const [booksData, setBooksData] = useState(books)

    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, msg) => {
        api[type]({
            message: 'Error',
            description: msg,
        });
    };

    const addUnit = () => {
        axios.post(route('admin.unit.store'), {
            unit_number: unitNumber,
            book_id: bookId
        }).then(res => {
            setBooksData(booksData.map(el => {
                return el.id === bookId ? {...el, units: [...el.units, unitNumber]} : el
            }))
            setUnitNumber(null)
        }).catch((e)=>{
            openNotificationWithIcon('error', e.response.data.error)
        })
    }

    const tableData = booksData.map(el => {
        return {...el, key: el.id, units: el.units.map(el => el.unit_number).join(', ')}
    })

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Page</h2>}
        >{contextHolder}<h3 className="text-lg mb-3">Add Book</h3>
            <div className="flex">
                <div className="w-2/5 flex flex-col mr-3 space-y-4">
                    <Select
                        placeholder="Select a book"
                        onChange={(id)=>setBookId(id)}
                        options={books.map( el => ({value: el.id, label: el.book_number}))}
                    />
                    <InputNumber value={unitNumber} onChange={(num)=>setUnitNumber(num)} min={1} max={20} prefix={<CopyOutlined />} />
                    <Button disabled={!unitNumber || !bookId} className="w-2/4" onClick={addUnit} type="primary">Submit</Button>
                </div>
                <div className="w-3/5 flex flex-col">
                    <Table pagination={false} bordered  columns={columns} dataSource={tableData} />
                </div>
            </div>
        </AdminLayout>
    );
}

export default Unit;