import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {Menu} from "antd";
import {
    BuildOutlined, HeartOutlined,
    LineChartOutlined,
    RiseOutlined,
} from "@ant-design/icons";
import {useState} from "react";
import WordsList from "@/Components/Dashboard/WordsList.jsx";
import TrainWords from "@/Components/Dashboard/TrainWords.jsx";
import { DashboardContext } from "@/Components/Dashboard/DashboardContext.js";
import UnitStory from "@/Components/Dashboard/UnitStory.jsx";
import FavoriteList from "@/Components/Dashboard/FavoriteList.jsx";

const getItems = (books) => {
    return [
        {
            key: 'sub1',
            label: 'Choose Unit',
            icon: <BuildOutlined />,
            children: books.map(book => {
                return {
                    key: `book-${book.id}`,
                    label: `Book - ${book.book_number}`,
                    type: 'group',
                    children: book.units.map( unit => {
                        return {
                            key: `unit-${book.id}.${unit.id}`,
                            label: `Unit - ${unit.unit_number}`,
                            children: [
                                { key: `learn-${book.id}.${unit.id}`, label: 'Learn' },
                                { key: `train-${book.id}.${unit.id}`, label: 'Train'},
                                { key: `story-${book.id}.${unit.id}`, label: 'Story'},
                                { key: `exam-${book.id}.${unit.id}`, label: 'Examination' },
                            ],
                        }
                    })
                }
            })
        },
        {
            key: 'favorite',
            label: 'Favorites',
            icon: <HeartOutlined />
        },
        {
            key: 'sub3',
            label: 'Statistic',
            icon: <LineChartOutlined />
        },
        {
            key: 'sub4',
            label: 'Train',
            icon: <RiseOutlined />
        },
    ]
}

export default function Dashboard({ auth, books, words, language, favoritesIds, bookUnit }) {
    const [wordsData, setWordsData] = useState(words)
    const [favoritesDataIds, setFavoritesDataIds] = useState(favoritesIds)
    const [isLoad, setIsLoad] = useState(false)
    const [bookId, setBookId] = useState(bookUnit.book_id)
    const [unitId, setUnitId] = useState(bookUnit.unit_id)
    const [mode, setMode] = useState('learn')


    const getUnit = (key, modeType) => {
        const [book_id, unit_id] = key.split('.')
        setIsLoad(true)

        axios(route('words.unit.list', {book_id, unit_id}))
            .then(res => {
                setWordsData(res.data)
                setIsLoad(false)
                setBookId(book_id)
                setUnitId(unit_id)
            })
    }

    const onClick = (e) => {
        const key = e.key.split('-')
        if(key.includes('favorite')){
            setMode('favorite')
        } else {
            setMode(key[0]);
            getUnit(key[1], key[0])
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <DashboardContext.Provider value={{
                wordsData,
                language,
                favoritesDataIds,
                setFavoritesDataIds,
                setWordsData,
                unitId,
                bookId
            }}>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex">
                            <Menu
                                onClick={onClick}
                                style={{
                                    width: 200,
                                }}
                                defaultSelectedKeys={`learn-${bookId}.${unitId}`}
                                defaultOpenKeys={['sub1']}
                                mode="inline"
                                items={getItems(books)}
                            />
                            {mode === 'learn' && <WordsList
                                isLoad={isLoad}
                                wordsData={wordsData}
                            />}
                            {mode === 'train' && <TrainWords
                                wordsData={wordsData}
                                setWordsData={setWordsData}
                            />}
                            {mode === 'story' && <UnitStory/>}
                            {mode === 'favorite' && <FavoriteList/>}
                        </div>
                    </div>
                </div>
            </DashboardContext.Provider>
        </AuthenticatedLayout>
    );
}
