import React, {useState} from 'react';
import AdminLayout from "@/Layouts/AdminLayout.jsx";
import { Input } from 'antd';
const { TextArea } = Input;


function Words({auth}) {
    const [words, setWords] = useState()

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Page</h2>}
        ><h3 className="text-lg mb-3">Add Words</h3>
            <div className="flex flex-col">
                <TextArea
                    value={words}
                    onChange={(e) => setWords(e.target.value)}
                    placeholder="Controlled autosize"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                />
            </div>
        </AdminLayout>
    );
}

export default Words;