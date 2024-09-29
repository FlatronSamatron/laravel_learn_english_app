import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {Menu} from "antd";
import {
    BuildOutlined, HeartOutlined,
    LineChartOutlined,
    RiseOutlined,
} from "@ant-design/icons";
import {useState} from "react";
import UnitList from "@/Components/Dashboard/UnitList.jsx";
import TrainWords from "@/Components/Dashboard/TrainWords.jsx";
import { DashboardContext } from "@/Components/Dashboard/DashboardContext.js";

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
                                { key: `exam-${book.id}.${unit.id}`, label: 'Examination' },
                            ],
                        }
                    })
                }
            })
        },
        {
            key: 'sub2',
            label: 'Favorites',
            icon: <HeartOutlined />,
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

export default function Dashboard({ auth, books, words, language, favorites, bookUnit }) {
    const [wordsData, setWordsData] = useState(words)
    const [favoritesData, setFavoritesData] = useState(favorites)
    const [isLoad, setIsLoad] = useState(false)
    const [bookUnitId, setBookUnitId] = useState(`${bookUnit.book_id}.${bookUnit.unit_id}`)
    const [mode, setMode] = useState('learn')


    const getUnit = async (key) => {
        const [book_id, unit_id] = key ? key.split('-')[1].split('.') : bookUnitId.split('.')

        if(`${book_id}.${unit_id}` !== bookUnitId || mode === 'train'){
            setIsLoad(true)
            await axios(route('words.unit.list', {book_id, unit_id}))
                .then(res => {
                    setWordsData(res.data)
                    setIsLoad(false)
                })
            setBookUnitId(`${book_id}.${unit_id}`)
        }
    }

    const onClick = (e) => {
        if(e.key.includes('learn')){
            setMode('learn');
            getUnit(e.key)
        }
        if(e.key.includes('train')){
            setMode('train');
            getUnit(e.key)
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
                favoritesData,
                setFavoritesData,
                setWordsData,
                getUnit
            }}>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex">
                            <Menu
                                onClick={onClick}
                                style={{
                                    width: 200,
                                }}
                                defaultSelectedKeys={`learn-${setBookUnitId}`}
                                defaultOpenKeys={['sub1']}
                                mode="inline"
                                items={getItems(books)}
                            />
                            {mode === 'learn' && <UnitList
                                isLoad={isLoad}
                            />}
                            {mode === 'train' && <TrainWords/>}
                        </div>
                    </div>
                </div>
            </DashboardContext.Provider>
        </AuthenticatedLayout>
    );
}
