import React, {useContext, useEffect} from 'react';
import {Button, Table} from "antd";
import {DashboardContext} from "@/Components/Dashboard/DashboardContext.js";
import {ArrowLeftOutlined, StarFilled, StarOutlined} from "@ant-design/icons";
import FavoriteStar from "@/Components/Dashboard/FavoriteStar.jsx";


const columns = [
    {
        title: '#',
        dataIndex: 'number',
        key: 'number',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Translate',
        dataIndex: 'translate',
        key: 'translate',
    },
    {
        title: 'Favorite',
        dataIndex: 'favorite',
        key: 'favorite',
    },
];

const GameStatistic = ({statistic, isEn}) => {

    const {
        language
    } = useContext(DashboardContext);

    const getDataSource = (words) => {
        return words.map((word, i) => {
            const translateWords = word.word_translate.map(item => <span>{item[language]}</span>)
            return {
                number: i+1,
                key: word.id,
                name: isEn ? word.name : <p>{translateWords}</p>,
                translate: isEn ? <p>{translateWords}</p> : word.name,
                favorite: <FavoriteStar word={word}/>
            }
        })
    }

    const correct = statistic.filter( el => el.isCorrectAnswer)
    const incorrect = statistic.filter( el => !el.isCorrectAnswer)

    return (
        <div className="flex flex-col m-auto">
            <h2
                className="flex justify-center font-bold text-2xl uppercase text-green-500 my-3">Game Statistic:
            </h2>
            <div className="flex gap-10">
                <div>
                    <h2 className="font-bold text-lg text-green-600">Correct answers:</h2>
                    <Table bordered={true} pagination={false} dataSource={getDataSource(correct)} columns={columns}/>
                </div>
                <div>
                    <h2 className="font-bold text-lg text-red-600">Incorrect answers:</h2>
                    <Table bordered={true} pagination={false} dataSource={getDataSource(incorrect)} columns={columns}/>
                </div>
            </div>
        </div>
    );
};

export default GameStatistic;