import React, {useEffect, useState} from 'react';
import AdminLayout from "@/Layouts/AdminLayout.jsx";
import {Button, Input, Modal, Select, Table} from 'antd';
import translator from "@/Shared/translator.js"
import WordItem from "@/Components/WordItem.jsx";

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
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
    }
];


function Words({auth, books}) {
    const [bookId, setBookId] = useState(null)
    const [unitId, setUnitId] = useState(null)
    const [wordsList, setWordsList] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editWord, setEditWord] = useState({});

    console.log(editWord)

    const showEditModal = (word) => {
        setEditWord(word)
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setEditWord({})
        setIsModalOpen(false);
    };

    const unitOptions = bookId ? books.find(el => el.id === bookId)?.units.map(el => ({
        value: el.id,
        label: el.unit_number
    })) : []

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
            actions: <div>
                <Button onClick={() => showEditModal(el)}>Edit</Button>
            </div>
        }
    })

    const getWords = () => {
        axios.post(route('admin.words.list.get'), {
            book_id: bookId,
            unit_id: unitId
        }).then(res => setWordsList(res.data))
    }

    const addWordTranslate = (translate) => {
        const {ru, ua} = translate
        axios.post(route('admin.words.translate.create', {
            word: translate.word_id
        }), {ru, ua}).then((res) => {
            setWordsList(wordsList.map( word => {
                if(word.id === translate.word_id){
                    return {
                        ...word,
                        word_translate: [
                            ...word.word_translate,
                            res.data
                        ]
                    }
                } else {
                    return word
                }
            }))
            handleCancel()
        })
    }

    const editWordTranslate = (translate) => {
        const {id, ru, ua} = translate
        axios.post(route('admin.words.translate.update', {
         translate: id
        }), {ru, ua}).then(() => {
            setWordsList(wordsList.map( word => {
                return word.id === translate.word_id ? editWord : word
            }))
            handleCancel()
        })
    }

    const deleteWordTranslate = (translate) => {
        const {id, word_id} = translate
        axios.delete(route('admin.words.translate.delete', {
            translate: id
        })).then(() => {
            setWordsList(wordsList.map(word => {
                if(word.id === word_id){
                    return {
                        ...word,
                        word_translate: word.word_translate.filter(el => el.id !== id)
                    }
                } else {
                    return word
                }
            }))
            handleCancel()
        })
    }


    const setLangWord = (lang, key, value) => {
        setEditWord({
            ...editWord,
            word_translate: editWord.word_translate.map((el, i) => {
                return i === key ? {...el, [lang]: value} : el
            })
        })
    }

    const addTranslateWord = () => {
        setEditWord({
            ...editWord,
            word_translate: [
                ...editWord.word_translate,
                {ru: '', ua: '', word_id: editWord.id}
            ]
        })
    }

    const removeTranslateWord = (key) => {
        setEditWord({
            ...editWord,
            word_translate: editWord.word_translate.filter((el, i) => {
                return i !== key
            })
        })
    }

    // admin.words.translate.update

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
            <Modal title={editWord.name} open={isModalOpen} onCancel={handleCancel} footer={null}>
                {editWord?.word_translate?.map((el, i) => {
                    return <div className="flex mb-3 space-x-3">
                        <Input
                            size="small"
                            key={el.id + 'ru'}
                            placeholder="add translation"
                            value={el.ru}
                            prefix={"ru"}
                            onChange={(e) => {
                                setLangWord('ru', i, e.target.value)
                            }}
                        />
                        <Input
                            size="small"
                            key={el.id + 'ua'}
                            placeholder="add translation"
                            value={el.ua}
                            prefix={"ua"}
                            onChange={(e) => {
                                setLangWord('ua', i, e.target.value)
                            }}
                        />
                        {el.id && <div className="w-[180px]">
                            <Button onClick={() => editWordTranslate(el)} size="small">Edit</Button>
                            {i !== 0 &&<Button size="small" onClick={() => deleteWordTranslate(el)} danger variant="solid">
                                Delete
                            </Button>}
                        </div>}
                        {!el.id && <div className="w-[180px]">
                            <Button size="small" onClick={()=>addWordTranslate(el)}>Add</Button>
                            <Button size="small" onClick={()=>removeTranslateWord(i)} danger variant="solid">
                                Remove
                            </Button>
                        </div>}
                    </div>
                })}
                <Button className="w-full" size="small" onClick={addTranslateWord}>+ Add translate</Button>
            </Modal>
        </AdminLayout>
    );
}

export default Words;