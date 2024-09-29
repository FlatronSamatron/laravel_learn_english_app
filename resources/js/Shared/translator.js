import axios from 'axios';

const translator = async (q = 'hello', target = "ru") => {
    try {
        const res = await axios(`http://localhost:3000/${q}/${target}`)
        return JSON.parse(res.data.result)
    } catch (error) {
        console.error(error);
    }
}

// const translate = async (q, target = "ru") => {
//     const options = {
//         method: 'POST',
//         url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2',
//         headers: {
//             'x-rapidapi-key': 'bb05fcc6a0msh2a2e7a43e24a623p1e2b11jsn9883c3dd0846',
//             'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
//             'Content-Type': 'application/json'
//         },
//         data: {
//             q,
//             source: 'en',
//             target
//         }
//     };
//
//     try {
//         const response = await axios.request(options);
//         return response.data.data.translations.translatedText
//     } catch (error) {
//         console.error(error);
//     }
// }

// const translate = async (q, target = "ru") => {
//     const options = {
//         method: 'POST',
//         url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
//         params: {
//             to: target,
//             from: 'en',
//             'api-version': '3.0',
//             profanityAction: 'NoAction',
//             textType: 'plain'
//         },
//         headers: {
//             'x-rapidapi-key': 'bb05fcc6a0msh2a2e7a43e24a623p1e2b11jsn9883c3dd0846',
//             'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
//             'Content-Type': 'application/json'
//         },
//         data: [
//             {
//                 Text: q
//             }
//         ]
//     };
//
//     try {
//         const response = await axios.request(options);
//         console.log(response.data);
//     } catch (error) {
//         console.error(error);
//     }
// }

export default translator