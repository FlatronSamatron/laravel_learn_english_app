import React, {useContext, useMemo} from 'react';
import {StarFilled, StarOutlined} from "@ant-design/icons";
import {DashboardContext} from "@/Components/Dashboard/DashboardContext.js";

const FavoriteStar = ({word}) => {
    const {
        favoritesDataIds,
        setFavoritesDataIds,
    } = useContext(DashboardContext);

    const setFavorite = () => {
        axios.post(route('word.favorite'), {
            'word_id': word.id,
            'book_id': word.book_id,
            'unit_id': word.unit_id,
        }).then(res => {
            setFavoritesDataIds(res.data);
        })
    }

    const isFavorite = () => {
        return favoritesDataIds.some(id => id === word.id)
    }

    return (
        <>
            {isFavorite() ? <StarFilled
                className="text-3xl text-yellow-400 cursor-pointer favorite"
                onClick={setFavorite}
            /> : <StarOutlined
                className="text-3xl text-yellow-400 cursor-pointer favorite"
                onClick={setFavorite}
            />}
        </>
    );
};

export default FavoriteStar;