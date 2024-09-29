import React from 'react';
import {Card, Input} from "antd";

const { Meta } = Card;

const WordItem = ({word, setLangWord}) => {
    return (
        <Card
            title={word.name}
        >
            <h3 className="mb-3 text-sm">{word.word_hash}</h3>
            <div className='flex flex-col space-y-3'>
                <div className='flex flex-col space-y-3'>
                    Ru:
                    {word.translate.ru.name.map((el, i) => {
                        return <Input
                            size="small"
                            key={i}
                            addonBefore={<div onClick={()=>setLangWord('ru', word.name, i)}>-</div>}
                            placeholder="add translation"
                            addonAfter={<div onClick={()=>setLangWord('ru', word.name, null)}>+</div>}
                            value={el}
                            onChange={(e)=> {setLangWord('ru', word.name, i, e.target.value)}}
                        />
                    })}
                </div>
                {word.translate.ua && <div className='flex flex-col space-y-3'>
                    Ua:
                    {word.translate.ua.name.map((el, i) => {
                        return <Input
                            size="small"
                            key={i}
                            addonBefore={<div onClick={() => setLangWord('ua', word.name, i)}>-</div>}
                            placeholder="add translation"
                            addonAfter={<div onClick={() => setLangWord('ua', word.name, null)}>+</div>}
                            value={el}
                            onChange={(e) => {
                                setLangWord('ua', word.name, i, e.target.value)
                            }}
                        />
                    })}
                </div>}
            </div>
        </Card>
    );
};

export default WordItem;