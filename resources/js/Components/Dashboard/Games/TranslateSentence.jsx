import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {DashboardContext} from "@/Components/Dashboard/DashboardContext.js";
import {ArrowRightOutlined, CopyOutlined} from "@ant-design/icons";
import {Button, Card, Divider, Input, List, Table} from "antd";
import Meta from "antd/es/card/Meta.js";
import {copyToClipBoard} from "@/Shared/utils.js";

const columns = [
    {
        title: '#',
        dataIndex: 'number',
        key: 'number',
    },
    {
        title: 'Example',
        dataIndex: 'example',
        key: 'example',
    },
    {
        title: 'Translate',
        dataIndex: 'translate',
        key: 'translate',
    }
];

const TranslateSentence = ({isRandom}) => {
    const [wordNumber, setWordNumber] = useState(0)
    const [answer, setAnswer] = useState("");
    const [isAnswered, setIsAnswered] = useState(false);
    const [prevTranslates, setPrevTranslates] = useState([]);
    const [translates, setTranslates] = useState([]);

    const [isFinish, setIsFinish] = useState(false);

    const btnRef = useRef(null);
    const inputRef = useRef(null);

    const {
        wordsData,
        language
    } = useContext(DashboardContext);

    const words = useMemo(() => {
        return isRandom ? [...wordsData].sort(() => .5 - Math.random()) : wordsData;
    }, [isRandom, wordsData]);

    const word = words[wordNumber]

    const audio = useMemo(() => {
        return new Audio(`/assets/example_audios/${word.word_hash}.example.mp3`)
    }, [wordNumber]);

    const prevTranslatesList = useMemo(() => {
        return prevTranslates.filter( el => el.word_id === word.id)
    }, [prevTranslates]);

    useEffect(() => {
        inputRef.current.focus();
    }, [wordNumber]);

    useEffect(()=>{
        const {unit_id, book_id} = word

        axios(route('words.example.translates', {book_id, unit_id}))
            .then(res => setPrevTranslates(res.data))

    }, [])

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !!event.target.value) {
            console.log(word.example)
            setTranslates(prev => [...prev, {
                example: word.example,
                translate: event.target.value
            }])
            setIsAnswered(true)
            btnRef && setInterval(()=>{
                btnRef.current?.focus()
            },0)

            audio.play()

            axios.post(route('words.example'), {
                word_id: word.id,
                translate: answer
            })
        }
    };

    const next = () => {
        setAnswer("");
        setIsAnswered(false);
        audio.pause()

        wordNumber === words.length - 1 ?
            setIsFinish(true)
            : setWordNumber(prev => prev + 1)
    }

    if(isFinish) {
        return <Table
            className="m-auto"
            bordered={true}
            pagination={false}
            dataSource={translates.map((el, i) => {
                return {
                    number: i+1,
                    key: i,
                    example: <p dangerouslySetInnerHTML={{__html: el.example}}></p>,
                    translate: <p>{el.translate}</p>
                }
            })}
            columns={columns}
        />
    }

    const lastTranslate = prevTranslatesList[prevTranslatesList.length-1]

    return (
        <div className="m-auto w-full flex items-center justify-center flex-col space-y-5">
            <div className="font-bold">
                {wordNumber+1} / {words.length}
            </div>
            <Card
                cover={<img alt="image" src={`/assets/images/${word.word_hash}.jpg`}/>}
                className="relative w-3/5"
            >
                <Meta
                    title={word.example_translate[0][language]}
                    description={<span>Last translated {lastTranslate ? lastTranslate.date : "never"}</span>}
                />
                <div className="flex items-center mt-4">
                    <Input
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={handleKeyDown}
                        type="text"
                        rootClassName="rounded"
                        ref={inputRef}
                        disabled={isAnswered}
                    />
                    <CopyOutlined className="text-2xl ml-2 cursor-pointer hover-scale" onClick={()=> copyToClipBoard(answer)}/>
                </div>
                {isAnswered && (
                    <div>
                        <Divider orientation="left">Previous translates:</Divider>
                        <List
                            size="small"
                            bordered
                            dataSource={prevTranslatesList}
                            renderItem={(item) => <List.Item className="flex justify-between">
                                <span>{item.translate}</span>
                                <span>{item.date}</span>
                            </List.Item>}
                        />
                    </div>
                )}
                {isAnswered && (
                    <div
                        className="flex items-center justify-center gap-3 text-lg bg-gray-100 rounded my-3 p-2 font-bold">
                        <p dangerouslySetInnerHTML={{__html: word.example}}></p>
                    </div>
                )}
                {isAnswered && <Button ref={btnRef} onClick={next} className="w-full">Next <ArrowRightOutlined/></Button>}
            </Card>
        </div>
    );
};

export default TranslateSentence;