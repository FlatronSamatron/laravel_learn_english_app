import React, {useState} from 'react';
import AdminLayout from "@/Layouts/AdminLayout.jsx";
import {Button, notification, Select} from "antd";
import ReactQuill from "react-quill";

const Story = ({auth, books}) => {
    const [bookId, setBookId] = useState(null)
    const [unitId, setUnitId] = useState(null)
    const [story, setStory] = useState('')

    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, msg) => {
        api[type]({
            message: type,
            description: msg,
        });
    };

    const unitOptions = bookId ? books.find(el => el.id === bookId)?.units.map(el => ({
        value: el.id,
        label: el.unit_number
    })) : []

    const addStory = () => {
        axios.post(route('admin.stories.store'), {
            text: story,
            unit_id: unitId
        }).then(res => {
            openNotificationWithIcon('success', res.data.message)
        }).catch((e)=>{
            openNotificationWithIcon('error', e.response.data.error)
        })
    }

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Page</h2>}
        >
            {contextHolder}
            <h3 className="text-lg mb-3">Add Story</h3>
            <div className="flex flex-col space-y-5 my-5">
                <Select
                    placeholder="Select a book"
                    onChange={(id) => {
                        setBookId(id)
                        setStory('')
                    }}
                    options={books.map(el => ({value: el.id, label: el.book_number}))}
                />
                <Select
                    placeholder="Select an unit"
                    onChange={(id) => {
                        setUnitId(id)
                        setStory('')
                    }}
                    options={unitOptions}
                />

                <div>
                    <ReactQuill theme="snow" value={story} onChange={setStory}/>
                </div>

                <Button disabled={!bookId || !unitId} onClick={addStory} className="w-full mb-5"
                        type="primary">Add story</Button>
            </div>
        </AdminLayout>
    );
};

export default Story;