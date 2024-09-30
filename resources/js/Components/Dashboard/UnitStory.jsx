import React, {useContext, useEffect, useRef, useState} from 'react';
import {DashboardContext} from "@/Components/Dashboard/DashboardContext.js";
import parse from 'html-react-parser';
import {Skeleton, Tooltip} from "antd";

const UnitStory = () => {
    const [story, setStory] = useState('');
    const [isLoad, setIsLoad] = useState(true);
    const {language, wordsData, unitId, bookId} = useContext(DashboardContext);


    useEffect(() => {
        axios(route('units.story', unitId))
            .then(res => {
                setStory(res.data.text)
                setIsLoad(false)
            })
    }, [unitId]);


    const getWordTranslate = (search) => {
        return wordsData.find( word => {
            return word.name.toLowerCase().startsWith(search.trim().slice(0, 5).toLowerCase())
        })?.word_translate.map( el => el[language]).join(', ')
    }


    const options = {
        replace: (domNode) => {
            if (domNode.name === 'strong') {
                const content = domNode.children[0].data;
                return (
                    <Tooltip placement="top" title={getWordTranslate(content)}>
                        <strong
                            className="cursor-pointer bold"
                        >
                            {content}
                        </strong>
                    </Tooltip>
                );
            }
        },
    };

    const bgStyle = {
        backgroundImage: `url(/assets/story_bg/${unitId}.jpg)`,
        backgroundSize: 'cover'
    }

    return (
        <div className="p-5 w-full bg-blue-50" style={bgStyle}>
            <div className="story w-3/4 m-auto rounded shadow-xl p-2 bg-white text-lg mb-3 font-bold text-blue-700">
                Story (book {bookId}/unit {unitId})
            </div>
            <div className="story w-3/4 m-auto rounded shadow-xl p-5 bg-white text-lg space-y-1">
                {isLoad ? <Skeleton active paragraph={{rows: 20}}/> : parse(story, options)}
            </div>
        </div>
    );
};

export default UnitStory;