import React, {useEffect, useState} from 'react';
import AdminLayout from "@/Layouts/AdminLayout.jsx";
import {Button, Input, Select, Table} from 'antd';
import translator from "@/Shared/translator.js"

const columns = [
    {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Transcription',
        dataIndex: 'transcription',
        key: 'transcription',
    },
    {
        title: 'Definition',
        dataIndex: 'definition',
        key: 'definition',
    },
    {
        title: 'Example',
        dataIndex: 'example',
        key: 'example',
    }
];



function Words({auth, books}) {
    const [bookId, setBookId] = useState(null)
    const [unitId, setUnitId] = useState(null)
    const [wordsList, setWordsList] = useState([])

    useEffect(()=>{
        translator().then(res => console.log(res))
    }, [])

    const unitOptions = bookId ? books.find(el => el.id === bookId)?.units.map(el => ({value: el.id, label: el.unit_number})) : []

    const tableData = wordsList.map(el => {
        return {
            ...el,
            key: el.id,
            name: <div className="flex flex-col space-y-2">
                <span className="font-extrabold">{el.name}</span>
                <hr/>
                {el.word_translate.map(el => {
                    return <span className="flex flex-col">
                        <span>Ru: {el.ru}</span>
                        <span>Ua: {el.ua}</span>
                    </span>
                })}
            </div>,
            definition: <div className="flex flex-col space-y-2">
                <div className="text-green-600" dangerouslySetInnerHTML={{__html: el.definition}}></div>
                <hr/>
                {el.definition_translate.map(el => {
                    return <span className="flex flex-col">
                        <span>Ru: {el.ru}</span>
                        <span>Ua: {el.ua}</span>
                    </span>
                })}
            </div>,
            example: <div className="flex flex-col space-y-2">
                <div className="text-blue-600" dangerouslySetInnerHTML={{__html: el.example}}></div>
                <hr/>
                {el.example_translate.map(el => {
                    return <span className="flex flex-col">
                        <span>Ru: {el.ru}</span>
                        <span>Ua: {el.ua}</span>
                    </span>
                })}
            </div>,
        }
    })

    const getWords = () => {
        axios.post(route('admin.words.list.get'), {
            book_id: bookId,
            unit_id: unitId
        }).then(res => setWordsList(res.data))
    }

    useEffect(()=>{
        console.log(wordsList);
    }, [wordsList])

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Page</h2>}
        ><h3 className="text-lg mb-3">Words List</h3>
            <div className="flex flex-col space-y-3 my-5">
                <Select
                    placeholder="Select a book"
                    onChange={(id) => setBookId(id)}
                    options={books.map(el => ({value: el.id, label: el.book_number}))}
                />
                <Select
                    placeholder="Select an unit"
                    onChange={(id) => setUnitId(id)}
                    options={unitOptions}
                />
            </div>
            <Button disabled={!bookId || !unitId} onClick={getWords} className="w-full mb-5" type="primary">Get</Button>
            <div>
                <Table pagination={false} bordered columns={columns} dataSource={tableData}/>
            </div>
        </AdminLayout>
    );
}

export default Words;