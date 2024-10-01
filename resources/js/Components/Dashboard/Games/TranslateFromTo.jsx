import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Button, Card, Divider, Input, Tooltip} from "antd";
import {
    ArrowDownOutlined,
    PlayCircleTwoTone,
    StarFilled,
    StarOutlined,
    ArrowRightOutlined
} from "@ant-design/icons";
import {DashboardContext, GameContext} from "@/Components/Dashboard/DashboardContext.js";
import GameStatistic from "@/Components/Dashboard/Games/GameStatistic.jsx";
import {storeStatistic} from "@/Shared/utils.js";
import FavoriteStar from "@/Components/Dashboard/FavoriteStar.jsx";


const {Meta} = Card;

const TranslateFromTo = ({from, isRandom, wordsData}) => {
    const [wordNumber, setWordNumber] = useState(0)
    const [answer, setAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [checkAnswer, setCheckAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [statistic, setStatistic] = useState([]);
    const [isFinish, setIsFinish] = useState(false);

    const inputRef = useRef(null);
    const btnRef = useRef(null);

    const {
        language
    } = useContext(DashboardContext);

    const {
        setUnitStatistic, unitStatistic
    } = useContext(GameContext);

    const isEn = from === "en";

    const words = useMemo(() => {
        return isRandom ? [...wordsData].sort(() => .5 - Math.random()) : wordsData;
    }, [isRandom, wordsData])

    const word = words[wordNumber]

    const audio = useMemo(() => {
        return new Audio(`/assets/word_audios/${word.word_hash}.word.mp3`)
    }, [wordNumber]);

    const translate = word.word_translate.map((item) => item[language])
    const cardTitle = isEn ? [word.name] : translate;
    const cardTranslate = isEn ? translate : [word.name];

    useEffect(() => {
        isEn && audio.play();
        inputRef.current.focus();
    }, [wordNumber]);


    const checkCorrect = () => {
        let correct = 0;

        const result = answer.toLowerCase().split("").map((item, i) => {

            const isCorrectValue = cardTranslate.some((value) => {
                return value[i] === item
            });
            isCorrectValue && correct++;
            return (
                <span
                    key={item + i}
                    className={isCorrectValue ? "text-green-500" : "text-red-500"}
                >
              {item}
            </span>)
        });

        const isCorrectAnswer = ((correct * 100) / answer.length >= 70)
        setIsCorrect(isCorrectAnswer);

        return {
            result,
            isCorrectAnswer
        };
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            const {result,isCorrectAnswer} = checkCorrect()
            setCheckAnswer(result);
            setIsAnswered(true);
            setStatistic([...statistic, {
                ...word,
                isCorrectAnswer
            }])
            !isEn && audio.play();

            btnRef && setInterval(()=>{
                btnRef.current?.focus()
            },0)

            storeStatistic(word, isCorrectAnswer).then(res => {
                setUnitStatistic([...unitStatistic, {...res, word_id: word.id}])
            })
        }
    };

    const next = () => {
        setAnswer("");
        setIsCorrect(false);
        setCheckAnswer(null);
        setIsAnswered(false);

        wordNumber === words.length-1 ?
            setIsFinish(true)
            : setWordNumber(prev => prev + 1)
    }

    if(isFinish) {
        return <GameStatistic statistic={statistic} isEn={isEn}/>
    }

    return (
        <div className="m-auto flex flex-col items-center space-y-5">
            <div className="font-bold">
                {wordNumber + 1} / {words.length}
            </div>
            <Card
                className="relative"
                cover={<img alt="image" src={`/assets/images/${word.word_hash}.jpg`}/>}
            >
                <div className="absolute top-3 right-3">
                    <FavoriteStar word={word}/>
                </div>

                <Meta
                    style={{textAlign: "center"}}
                    title={
                        <div className="font-bold text-2xl flex gap-4 justify-center">
                            {cardTitle.join(', ').toUpperCase()}
                            {isEn || isAnswered && <PlayCircleTwoTone
                                className="cursor-pointer hover-scale"
                                onClick={() => audio.play()}
                            />}
                        </div>
                    }
                    description={<p className="text-xl">{isEn ? word.transcription : null}</p>}
                />
                <Input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{marginTop: "20px"}}
                    type="text"
                    ref={inputRef}
                    rootClassName="rounded"
                    disabled={isAnswered}
                />
                {isAnswered && (
                    <div
                        className="flex items-center justify-center flex-col gap-3 text-lg bg-gray-100 rounded my-3 p-2 font-bold">
                        <p>{checkAnswer}</p>
                        <ArrowDownOutlined/>
                        <p>
                            {cardTranslate.join(', ')}
                        </p>
                        {!isEn && <p>{word.transcription}</p>}
                    </div>
                )}
                {isAnswered && <div>
                    <Divider style={{
                        borderColor: isCorrect ? 'rgb(34 197 94)' : 'rgb(239 68 68)',
                        color: isCorrect ? 'rgb(34 197 94)' : 'rgb(239 68 68)',
                        fontWeight: 700
                    }}>{isCorrect ? 'CORRECT' : 'INCORRECT'}</Divider>
                    <Button ref={btnRef} onClick={next} className="w-full">Next <ArrowRightOutlined/></Button>
                </div>}
            </Card>
        </div>
    );
};

export default TranslateFromTo;