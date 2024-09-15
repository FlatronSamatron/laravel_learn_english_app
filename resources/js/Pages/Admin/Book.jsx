import React, {useState} from 'react';
import AdminLayout from "@/Layouts/AdminLayout.jsx";
import {BookOutlined, CopyOutlined} from '@ant-design/icons';
import {Input, Button, Table, InputNumber} from 'antd';
import ReactQuill from "react-quill";

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
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Units count',
        dataIndex: 'units_count',
        key: 'units_count',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    }
];

function Book({auth, books}) {
    const [bookNumber, setBookNumber] = useState(null)
    const [description, setDescription] = useState('')
    const [booksData, setBooksData] = useState(books)

    const tableData = booksData.map(el => {
        return {...el, key: el.id, description: <div dangerouslySetInnerHTML={{__html: el.description}}></div>}
    })

    const addBook = () => {
        axios.post(route('admin.book.store'), {
            book_number: bookNumber,
            description
        }).then(res => {
            setBooksData([...booksData, res.data])
            setBookNumber('')
            setDescription('')
        })
    }

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Page</h2>}
        ><h3 className="text-lg mb-3">Add Book</h3>
            <div className="flex">
                <div className="w-2/5 flex flex-col mr-3 space-y-4">
                    <InputNumber value={bookNumber} onChange={(num)=>setBookNumber(num)} min={1} max={20} prefix={<BookOutlined />} />
                    <div>
                        <ReactQuill theme="snow" value={description} onChange={setDescription}/>
                    </div>
                    <Button className="w-2/4" onClick={addBook} type="primary">Submit</Button>
                </div>
                <div className="w-3/5 flex flex-col">
                    <Table pagination={false} bordered  columns={columns} dataSource={tableData} />
                </div>
            </div>
        </AdminLayout>
    );
}

export default Book;