import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {DashboardContext, GameContext} from "@/Components/Dashboard/DashboardContext.js";
import {ArrowRightOutlined, PlayCircleTwoTone, StarFilled, StarOutlined} from "@ant-design/icons";
import {Button, Card, Divider, Input, Tooltip} from "antd";
import Meta from "antd/es/card/Meta.js";
import GameStatistic from "@/Components/Dashboard/Games/GameStatistic.jsx";
import {storeStatistic} from "@/Shared/utils.js";

const FillTheGaps = ({isRandom}) => {
    const [wordNumber, setWordNumber] = useState(0)
    const [answer, setAnswer] = useState("");
    const [isAnswered, setIsAnswered] = useState(false);

    const [isCorrect, setIsCorrect] = useState(false);
    const [checkAnswer, setCheckAnswer] = useState(null);
    const [statistic, setStatistic] = useState([]);
    const [isFinish, setIsFinish] = useState(false);

    const btnRef = useRef(null);
    const inputRef = useRef(null);

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
        return {
            definition: new Audio(`/assets/definition_audios/${word.word_hash}.definition.mp3`),
            example: new Audio(`/assets/example_audios/${word.word_hash}.example.mp3`),
        }
    }, [wordNumber]);

    useEffect(() => {
        inputRef.current.focus();
    }, [wordNumber]);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            const {result, isCorrectAnswer} = checkCorrect()
            setCheckAnswer(result);
            setIsCorrect(isCorrectAnswer);
            setIsAnswered(true);
            setStatistic([...statistic, {
                ...word,
                isCorrectAnswer
            }])
            btnRef && setInterval(()=>{
                btnRef.current?.focus()
            },0)

            storeStatistic(word, isCorrectAnswer).then(res => {
                setUnitStatistic([...unitStatistic, {...res, word_id: word.id}])
            })

            audio.definition.play().then(() => {
                const onAudioEnded = () => {
                    audio.example.play();
                    audio.definition.removeEventListener('ended', onAudioEnded);
                };

                audio.definition.addEventListener('ended', onAudioEnded);
            })
        }
    };

    const checkCorrect = () => {
        let correct = 0;
        const wordValue = word.name.toLowerCase().split("")
        const answerValue = answer.toLowerCase().split("")

        const result = answerValue.map((item, i) => {
            const isCorrectValue = wordValue[i] === item
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

        return {
            result,
            isCorrectAnswer
        };
    };

    const next = () => {
        setAnswer("");
        setIsCorrect(false);
        setCheckAnswer(null);
        setIsAnswered(false);
        audio.example.pause();
        audio.definition.pause();

        wordNumber === words.length - 1 ?
            setIsFinish(true)
            : setWordNumber(prev => prev + 1)
    }

    if(isFinish) {
        return <GameStatistic statistic={statistic} isEn={true}/>
    }

    return (
        <div className="m-auto w-full flex items-center justify-center flex-col space-y-5">
            <div className="font-bold">
                {wordNumber + 1} / {words.length}
            </div>
            <Card
                cover={<img alt="image" src={`/assets/images/${word.word_hash}.jpg`}/>}
                className="relative w-3/5"
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
                <Meta
                    title={<Tooltip
                        overlayStyle={{maxWidth: 'max-content'}}
                        className="cursor-pointer"
                        placement="topLeft"
                        title={word.definition_translate[0][language]}>
                        <div className="flex items-center relative">
                            <p className={`${!isAnswered ? 'hide' : 'reveal'} mr-7`}
                               dangerouslySetInnerHTML={{__html: word.definition}}></p>
                            {isAnswered && <PlayCircleTwoTone
                                className="cursor-pointer text-xl absolute right-0"
                                onClick={() => audio.definition.play()}
                            />}
                        </div>
                    </Tooltip>}
                    description={<Tooltip
                        overlayStyle={{maxWidth: 'max-content'}}
                        className="cursor-pointer"
                        placement="topLeft"
                        title={word.example_translate[0][language]}>
                        <div className="flex items-center relative">
                            <p className={`${!isAnswered ? 'hide' : 'reveal'} mr-7`}
                               dangerouslySetInnerHTML={{__html: word.example}}></p>
                            {isAnswered && <PlayCircleTwoTone
                                className="cursor-pointer text-xl absolute right-0"
                                onClick={() => audio.example.play()}
                            />}
                        </div>
                    </Tooltip>}
                />
                <Input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{marginTop: "20px"}}
                    type="text"
                    rootClassName="rounded"
                    ref={inputRef}
                    disabled={isAnswered}
                />
                {isAnswered && (
                    <div
                        className="flex items-center justify-center gap-3 text-lg bg-gray-100 rounded my-3 p-2 font-bold">
                        <p>{checkAnswer}</p>
                        <ArrowRightOutlined/>
                        <p>{word.name}</p>
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

export default FillTheGaps;