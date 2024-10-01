import React, {useContext, useEffect, useState} from 'react';
import {Button, Checkbox, List} from "antd";
import TranslateFromTo from "@/Components/Dashboard/Games/TranslateFromTo.jsx";
import {DashboardContext, GameContext} from "@/Components/Dashboard/DashboardContext.js";
import {ArrowLeftOutlined} from "@ant-design/icons";
import ListenAndWrite from "@/Components/Dashboard/Games/ListenAndWrite.jsx";
import FillTheGaps from "@/Components/Dashboard/Games/FillTheGaps.jsx";
import TranslateSentence from "@/Components/Dashboard/Games/TranslateSentence.jsx";

const TrainWords = ({wordsData, setWordsData}) => {
    const [isRandom, setIsRandom] = useState(false)
    const [game, setGame] = useState(null)
    const [unitStatistic, setUnitStatistic] = useState([])

    const {language} = useContext(DashboardContext);

    useEffect(() => {
        setGame(null)
    }, [wordsData]);

    const updateStatistic = () => {
        const newWordData = wordsData.map(word => {
            const stat = unitStatistic.find(stat => stat.word_id === word.id);
            if (stat) {
                return {...word, word_statistic: stat}
            }
            return word
        })
        setWordsData(newWordData)
        setUnitStatistic([])
    }

    const back = () => {
        updateStatistic()
    }

    const data = [
        <span onClick={() => setGame(1)} className="text-blue-700 cursor-pointer">
            {`Translate from en to ${language}`}
        </span>,
        <span onClick={() => setGame(2)} className="text-blue-700 cursor-pointer">
            {`Translate from ${language} to en`}
        </span>,
        <span onClick={() => setGame(3)} className="text-blue-700 cursor-pointer">
            Listen and write the word
        </span>,
        <span onClick={() => setGame(4)} className="text-blue-700 cursor-pointer">
            Fill the gaps
        </span>,
        <span onClick={() => setGame(5)} className="text-blue-700 cursor-pointer">
            Translate the sentence
        </span>,
    ];

    const components = {
        1: <TranslateFromTo isRandom={isRandom} wordsData={wordsData} from='en'/>,
        2: <TranslateFromTo isRandom={isRandom} wordsData={wordsData}/>,
        3: <ListenAndWrite isRandom={isRandom} wordsData={wordsData}/>,
        4: <FillTheGaps isRandom={isRandom} wordsData={wordsData}/>,
        5: <TranslateSentence isRandom={isRandom} wordsData={wordsData}/>,
    }

    return (
        <GameContext.Provider value={{setUnitStatistic, unitStatistic}}>
            <div className="flex justify-center items-center w-full flex-col p-4">
                {!game && <List
                    size="large"
                    header={<div className="w-48 flex justify-between">
                        Choose game:
                        <Checkbox checked={isRandom} onChange={() => setIsRandom(!isRandom)}>Random</Checkbox>
                    </div>}
                    bordered
                    dataSource={data}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                />}
                {game && <div
                    className="relative w-full flex self-start justify-center items-center font-bold text-2xl uppercase text-blue-500 mb-5">
                    <Button className="absolute left-5" onClick={back}>
                        <ArrowLeftOutlined/> Back
                    </Button>
                    {data[game - 1].props.children}
                </div>}
                {game && components[game]}
            </div>
        </GameContext.Provider>
    );
};

export default TrainWords;