import React, {useEffect, useMemo, useState} from 'react';
import {Pagination, Segmented, Skeleton} from "antd";
import WordsList from "@/Components/Dashboard/WordsList.jsx";
import TrainWords from "@/Components/Dashboard/TrainWords.jsx";
import {chunks} from "@/Shared/utils.js";
import { Input } from 'antd';
const { Search } = Input;

const FavoriteList = () => {
    const [wordsData, setWordsData] = useState([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0
    });
    const [isTrain, setIsTrain] = useState(false);
    const [searchData, setSearchData] = useState([]);

    const isSearch = !!searchData.length

    const fetchData = () => {
        axios(route('word.favorite.list'))
            .then(res => {
                setWordsData(res.data)
                setPagination({...pagination, total: res.data.length})
            })
    }

    const onSearch = (s) => {
        setSearchData(wordsData.filter(word => {
            return word.name.startsWith(s)
        }))
    }

    useEffect(() => {
        fetchData()
    }, []);

    const learnData = useMemo(() => {
        return [...chunks(isSearch ? searchData : wordsData, 20)]
    }, [wordsData, searchData])

    const {current, total, pageSize} = pagination
    const isPagination = !isSearch && (total > pageSize)

    if(!learnData.length) {
        return <div className="p-4 w-full">
            <Skeleton active paragraph={{rows: 40}}/>
        </div>
    }

    return (
        <div className="w-full">
            <div className="w-full text-center mt-4">
                <Segmented
                    size="large"
                    options={['Favorite words list', 'Train favorite words']}
                    onChange={() => {
                        setIsTrain(!isTrain);
                    }}
                />
            </div>
            {isTrain && <TrainWords
                wordsData={wordsData}
                setWordsData={setWordsData}
            />}
            {!isTrain && <div>
                <Search
                    placeholder="search word"
                    allowClear
                    enterButton
                    className="w-2/5 block mx-auto mt-4"
                    onSearch={(s)=>onSearch(s)}
                    onClear={() => setSearchData([])}
                    onChange={(s)=> !s.target.value && setSearchData([])}
                />
                <WordsList wordsData={learnData[isSearch ? 0 : current - 1]}/>
                {isPagination && <div className="w-full flex justify-end pr-4 pb-4">
                    <Pagination
                        current={current}
                        total={total}
                        pageSize={pageSize}
                        onChange={(page) => setPagination({...pagination, current: page})}
                    />
                </div>}
            </div>}
        </div>
    );
};

export default FavoriteList;