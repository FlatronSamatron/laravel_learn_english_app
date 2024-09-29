import React, {useEffect, useState} from 'react';
import AdminLayout from "@/Layouts/AdminLayout.jsx";
import {Button, Input, Select} from 'antd';

const {TextArea} = Input;
import translate from '@/Shared/translator.js'
import WordItem from "@/Components/WordItem.jsx";
import {removeTags} from "@/Shared/utils.js";


function Words({auth, books}) {
    const [words, setWords] = useState("")
    const [wordsData, setWordsData] = useState([])
    const [bookId, setBookId] = useState(null)
    const [unitId, setUnitId] = useState(null)

    const setWordTranslate = (lang, word, res, isNew) => {
        const {definition, example, name} = res
        if (isNew) {
            setWordsData((prev) => [...prev, {
                ...word,
                [lang]: [name.text],
                translate: {
                    [lang]: {
                        definition: definition.text,
                        example: example.text,
                        name: [name.text]
                    }
                }
            }])
        } else {
            setWordsData((prev) => prev.map(el => {
                if (el.word_hash === word.word_hash) {
                    return {
                        ...el,
                        translate: {
                            ...el.translate,
                            [lang]: {
                                definition: definition.text,
                                example: example.text,
                                name: [name.text]
                            }
                        }
                    }
                } else {
                    return el
                }
            }))
        }
    }

    const getWords = async (params, word) => {

        await translate(params, 'ru').then(res => {
            setWordTranslate('ru', word, res, true)
        })

        await translate(params, 'uk').then(res => {
            setWordTranslate('ua', word, res)
        })
    }

    const translateWords = (wordsList) => {
        if (wordsList.length === 0) {
            return
        }

        const word = wordsList.splice(-1)[0]

        const inputObject = {
            name: word.name,
            definition: removeTags(word.definition),
            example: removeTags(word.example),
        };

        const params = new URLSearchParams(inputObject)
        getWords(params, word).then(() => translateWords(wordsList))
    }


    const addWords = () => {
        const wordsList = words.trim().split('\n').map(el => {
            return el.split('\t')
        }).map(item => {
            return {
                word_hash: item[0],
                name: item[1],
                transcription: item[2],
                definition: item[4],
                example: item[5],
                unit_id: unitId,
                book_id: bookId,
            }
        }).reverse()

        translateWords(wordsList)
    }

    const unitOptions = bookId ? books.find(el => el.id === bookId)?.units.map(el => ({
        value: el.id,
        label: el.unit_number
    })) : []

    const submit = () => {
        axios.post(route('admin.words.store'), wordsData).then(() => {
            setWords('')
            setWordsData([])
            setBookId(null)
            setUnitId(null)
        })
    }

    const setLangWord = (lang, name, key, value) => {
        if (key === 0 && !value) return
        const changeTrans = wordsData.map(el => {
            if (el.name === name) {
                if (value) {
                    return {
                        ...el, translate: {
                            ...el.translate,
                            [lang]: {
                                ...el.translate[lang],
                                name: el.translate[lang].name.map((word, i) => {
                                    return i === key ? value : word
                                })
                            }
                        }
                    }
                } else if (key) {
                    return {
                        ...el, translate: {
                            ...el.translate,
                            [lang]: {
                                ...el.translate[lang],
                                name: el.translate[lang].name.filter((el, i) => i !== key)
                            }
                        }
                    }
                } else {
                    return {
                        ...el, translate: {
                            ...el.translate,
                            [lang]: {
                                ...el.translate[lang],
                                name: [...el.translate[lang].name, '']
                            }
                        }
                    }
                }
            } else {
                return el
            }


        })
        setWordsData(changeTrans)
    }

    // useEffect(() => {
    //     console.log(wordsData)
    // }, [wordsData])

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Page</h2>}
        ><h3 className="text-lg mb-3">Add Words ({wordsData.length})</h3>
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
                <TextArea
                    value={words}
                    onChange={(e) => setWords(e.target.value)}
                    placeholder="Controlled autosize"
                    autoSize={{minRows: 3, maxRows: 5}}
                />
                <div className='flex'>
                    <Button disabled={!bookId || !unitId || !words.length || !!wordsData.length} className="w-2/4 mr-4"
                            onClick={addWords} type="primary">Create</Button>
                    <Button disabled={!wordsData.length} className="w-2/4" onClick={submit}
                            type="primary">Submit</Button>
                </div>
            </div>
            <div className='grid grid-cols-4 gap-4'>
                {wordsData.map((word, i) => {
                    return <WordItem
                        word={word} key={word.name}
                        setLangWord={(lang, id, key, value) => setLangWord(lang, id, key, value)}
                    />
                })}
            </div>
        </AdminLayout>
    );
}

export default Words;