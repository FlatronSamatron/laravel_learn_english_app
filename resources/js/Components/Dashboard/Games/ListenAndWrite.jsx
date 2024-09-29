import React, {useContext, useEffect, useMemo, useState} from 'react';
import {DashboardContext, GameContext} from "@/Components/Dashboard/DashboardContext.js";
import {Button, Card, Divider} from "antd";
import {ArrowRightOutlined, HeartTwoTone, PlayCircleTwoTone, StarFilled, StarOutlined} from "@ant-design/icons";
import GameStatistic from "@/Components/Dashboard/Games/GameStatistic.jsx";
import {storeStatistic} from "@/Shared/utils.js";

const ATTEMPTS_COUNT = 3

const ListenAndWrite = ({isRandom}) => {
    const [wordNumber, setWordNumber] = useState(0)
    const [attempts, setAttempts] = useState(ATTEMPTS_COUNT)
    const [mixWord, setMixWord] = useState([])
    const [letterOrder, setLetterOrder] = useState(0)
    const [wrongLetterIndex, setWrongLetterIndex] = useState(null)
    const [wordAnswer, setWordAnswer] = useState([])
    const [statistic, setStatistic] = useState([])
    const [isFinish, setIsFinish] = useState(false)

    const {
        favoritesData,
        setFavoritesData,
        wordsData,
        language
    } = useContext(DashboardContext);

    const {
        setUnitStatistic, unitStatistic
    } = useContext(GameContext);

    const isFavorite = (id) => {
        return favoritesData.some(item => item === id)
    }

    const setFavorite = (word) => {
        axios.post(route('word.favorite'), {
            'word_id': word.id,
            'book_id': word.book_id,
            'unit_id': word.unit_id,
        }).then(res => {
            setFavoritesData(res.data);
        })
    }

    const words = useMemo(() => {
        return isRandom ? [...wordsData].sort(() => .5 - Math.random()) : wordsData;
    }, [isRandom, wordsData]);

    const word = words[wordNumber]

    const audio = useMemo(() => {
        return new Audio(`/assets/word_audios/${word.word_hash}.word.mp3`)
    }, [wordNumber]);

    useEffect(() => {
        audio.play()
        setMixWord(word.name.split('').sort(() => .5 - Math.random()))
        setAttempts(ATTEMPTS_COUNT)
        setLetterOrder(0)
        setWordAnswer([])
    }, [wordNumber]);

    const setStat = (isCorrectAnswer) => {
        setStatistic([...statistic, {
            ...word,
            isCorrectAnswer
        }])
        storeStatistic(word, isCorrectAnswer).then(res => {
            setUnitStatistic([...unitStatistic, {...res, word_id: word.id}])
        })
    }

    const clickHandler = (e, index) => {
        setWrongLetterIndex(null)
        const letter = e.target.innerText

        if(word.name.toLowerCase().split('')[letterOrder] === letter.toLowerCase()){
            setWordAnswer([...wordAnswer, letter])
            setLetterOrder(letterOrder+1)
            setMixWord(mixWord.filter((_,i) => i !== index))
            if(mixWord.length === 1) {
                setStat(true)
            }
        } else {
            if(attempts === 1){
                setAttempts(prev => prev-1)
                setStat(false)
            } else {
                setAttempts(prev => prev-1)
                setWrongLetterIndex(index)
            }
        }
    }

    const isAnswered = statistic[wordNumber]
    const isCorrect = statistic[wordNumber]?.isCorrectAnswer
    const answerBorder = isAnswered ? isCorrect ?
        "animate-shake border-green-300" : "animate-shake border-red-300" : ""

    if(isFinish){
        return <GameStatistic statistic={statistic} isEn={true}/>
    }

    const nextWord = () => {
        if(wordNumber === words.length - 1) {
            setIsFinish(true)
        } else {
            setWordNumber(prev => prev+1)
        }
    }

    return (
        <div className="m-auto w-full flex items-center justify-center flex-col space-y-5">
            <div className="font-bold">
                {wordNumber + 1} / {words.length}
            </div>
            <div className="flex space-x-3">{[...Array(attempts).keys()].map((_,i) => {
                return <HeartTwoTone className="text-2xl" key={i}/>
            })}</div>
            <Card
                cover={<img alt="image" src={`/assets/images/${word.word_hash}.jpg`}/>}
                className="w-[500px] relative"
                bodyStyle={{padding: "0 20px 20px 20px"}}
            >
                <div className="absolute top-3 right-3">
                    {isFavorite(word.id) ? <StarFilled
                        className="text-3xl text-yellow-400 cursor-pointer hover-scale"
                        onClick={() => setFavorite(word)}
                    /> : <StarOutlined
                        className="text-3xl text-yellow-400 cursor-pointer hover-scale"
                        onClick={() => setFavorite(word)}
                    />}
                </div>
                <PlayCircleTwoTone
                    className="cursor-pointer hover-scale absolute left-3 top-3 text-3xl"
                    onClick={() => audio.play()}
                />
                <div className="flex justify-center text-lg text-gray-400">
                    {word.word_translate.map(el => {
                        return el[language]
                    }).join(', ')}
                </div>
                <div
                    className={`min-h-12 uppercase border border-gray-200 justify-center rounded flex p-2 content-center font-bold text-xl tracking-widest ${answerBorder}`}>
                    {isAnswered && !isCorrect ? word.name : wordAnswer}
                </div>
            </Card>
            {!isAnswered && <div className="flex justify-center items-center space-x-3">
                {mixWord.length && mixWord.map((item, i) => {
                    return <span key={i} onClick={(e) => clickHandler(e, i)}
                                 className={`transition hover:shadow-xl cursor-pointer p-3 rounded border border-gray-200 uppercase font-bold ${wrongLetterIndex === i ? "animate-shake border-red-400" : ""}`}>
                        {item}
                    </span>
                })}
            </div>}
            {isAnswered && <div className="w-[500px] mt-0">
                <Divider style={{
                    borderColor: isCorrect ? 'rgb(34 197 94)' : 'rgb(239 68 68)',
                    color: isCorrect ? 'rgb(34 197 94)' : 'rgb(239 68 68)',
                    fontWeight: 700,
                    marginTop: 0
                }}>{isCorrect ? 'CORRECT' : 'INCORRECT'}</Divider>
                <Button onClick={nextWord} className="w-full">Next <ArrowRightOutlined/></Button>
            </div>}
        </div>
    );
};

export default ListenAndWrite;