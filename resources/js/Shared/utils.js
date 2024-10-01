function removeTags(str) {
    return str.replace(/<\/?[^>]+(>|$)/g, "");
}

function copyToClipBoard(copyText) {
    navigator.clipboard.writeText(copyText);
}

const getPercentage = (cnt, isCorrect, correct) => {
    const correctAnswers = (cnt*correct) / 100

    console.log(correctAnswers, cnt)

    return (((isCorrect ? !!correctAnswers ? correctAnswers : 1 : correctAnswers - 1) * 100) / cnt).toFixed(2)
}

const storeStatistic = async (word, isCorrect) => {
    const {word_statistic, id} = word
    const stat = !word_statistic ?
        {id: null, word_id: id, answer_cnt: 1, correct_percent: isCorrect ? 100 : 0} :
        {
            ...word_statistic,
            word_id: id,
            answer_cnt: word_statistic.answer_cnt+1,
            correct_percent: getPercentage(word_statistic.answer_cnt+1, isCorrect, word_statistic.correct_percent)
        }
    const res = await axios.post(route('words.statistic.store'), stat)
    return res.data
}

function* chunks(arr, n) {
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n);
    }
}

export {removeTags, copyToClipBoard, storeStatistic, chunks}