import React, {useContext} from 'react';
import {Divider, Progress, Skeleton, Tooltip} from 'antd';
import {PlayCircleTwoTone} from "@ant-design/icons";
import {DashboardContext} from "@/Components/Dashboard/DashboardContext.js";
import FavoriteStar from "@/Components/Dashboard/FavoriteStar.jsx";

const colors = [
    'pink',
    'red',
    'yellow',
    'orange',
    'cyan',
    'green',
    'blue',
    'purple',
    'geekblue',
    'magenta',
    'volcano',
    'gold',
    'lime',
];

const getColor = () => {
    return colors[Math.floor(Math.random() * ((colors.length - 1) + 1))]
}

const play = (file) => {
    const audio = new Audio(file);
    audio.play();
}

const UnitList = ({isLoad}) => {

    const {
        wordsData,
        language,
    } = useContext(DashboardContext);

    return (
        <div className="p-4 w-full grid grid-cols-2 gap-4">
            {wordsData.map( word => {

                if(isLoad) {
                    return <Skeleton active key={word.id}/>
                }

                return <div  key={word.id}
                    className="p-4 flex flex-col bg-white border border-gray-200 rounded-lg">
                    <div className="flex">
                        <img
                            className="object-cover rounded w-48"
                            src={`/assets/images/${word.word_hash}.jpg`} alt=""/>
                        <div className="pl-4 font-bold text-2xl flex flex-col justify-between w-full">
                            <div className="flex justify-between">
                                <div className="flex">
                                    <Tooltip overlayStyle={{maxWidth: 'max-content'}} className="cursor-pointer" title={word.word_translate[0][language]} placement="topLeft" trigger='click' color={getColor()}>
                                        <h2 className="text-gray-700 underline">{word.name.toUpperCase()}</h2>
                                    </Tooltip>
                                    <PlayCircleTwoTone
                                        onClick={()=> play(`/assets/word_audios/${word.word_hash}.word.mp3`)}
                                        className="cursor-pointer ml-3 hover-scale"
                                    />
                                </div>
                                <FavoriteStar word={word}/>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm">Correct answers:</span>
                                <Progress
                                    percent={word.word_statistic ? word.word_statistic.correct_percent : 0}
                                    status={'normal'}
                                />
                            </div>
                            <h3 className="text-gray-500">{word.transcription}</h3>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <Divider orientationMargin="0" size="small" orientation="left">
                            <p className="text-blue-600">Definition
                                <PlayCircleTwoTone
                                    className="ml-2 cursor-pointer hover-scale"
                                    onClick={()=> play(`/assets/definition_audios/${word.word_hash}.definition.mp3`)}
                                />
                            </p>
                        </Divider>
                        <Tooltip overlayStyle={{maxWidth: 'max-content'}} className="cursor-pointer" title={word.definition_translate[0][language]} placement="topLeft" trigger='click' color={getColor()}>
                            <p dangerouslySetInnerHTML={{__html: word.definition}}></p>
                        </Tooltip>
                        <Divider orientationMargin="0" size="small" orientation="left">
                            <p className="text-blue-600">Example
                                <PlayCircleTwoTone
                                    className="ml-2 cursor-pointer hover-scale"
                                    onClick={()=> play(`/assets/example_audios/${word.word_hash}.example.mp3`)}
                                />
                            </p>
                        </Divider>
                        <Tooltip overlayStyle={{maxWidth: 'max-content'}} className="cursor-pointer" title={word.example_translate[0][language]} placement="topLeft" trigger='click' color={getColor()}>
                            <p dangerouslySetInnerHTML={{__html: word.example}}></p>
                        </Tooltip>
                    </div>
                </div>
            })}
        </div>
    );
};

export default UnitList;