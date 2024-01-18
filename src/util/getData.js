import axios from 'axios';

const HOST = 'http://localhost:8000'
// const HOST = 'http://20.39.194.161';

const processStatus = {
    BEFORE_START: 0,
    ON_CRAWLING: 1,
    ON_TOPICMODELING: 2,
    ON_DTM: 3,
    ON_TREND: 4,
    END: 5,
    ERROR: 6
};

const heartbeat = async (clientID) => {
    const { data: data } = await axios.get(`${HOST}/heartbeat`, {params: {client_id: clientID}});
    console.log('hb', data, clientID);
    if (data.success)
        return data.status;
    else return 6;
}

const deleteUser = async (clientID) => {
    const { data: data } = await axios.get(`${HOST}/deleteuser`, {params: {client_id: clientID}});
    if (data.success)
        return data.status;
    else return -1;
}

const addUser = async (clientID) => {
    const { data: data } = await axios.get(`${HOST}/adduser`, {params: {client_id: clientID}});
    console.log('add', clientID);
    if (data.success)
        return 1;
    else return -1;
}

const getProjectList = async () => {
    const { data: data } = await axios.get(`${HOST}/getlist`);

    return data;
};

const getAnalysisResult = async (productID) => {
    const {data: data} = await axios.get(`${HOST}/getdata`, {params: {product_id: productID}});

    return data;
}

const getOriginalReview = async (productID, word) => {
    const {data: data} = await axios.get(`${HOST}/getoriginalreview`, {params: {product_id: productID, word: word}});

    return data;
}

const getWordTrend = async (productID, word) => {
    const {data: data} = await axios.get(`${HOST}/getwordtrend`, {params: {product_id: productID, word: word}});

    return data;
}

const startAnalysis = async (url, project_name, product_name, category, clientID) => {
    console.log(url, clientID);
    const { data: data } = await axios.post(`${HOST}/start`, {
        url: url,
        project_name: project_name,
        product_name: product_name,
        category: category,
        client_id: clientID,
    });
    console.log(data);
    return data;
};

const downloadCsv = async (filename) => {
    const config = {
        method: 'GET',
        url: `${HOST}/downloadcsv/?filename=${filename}`,
        responseType: 'blob',
    };
    const res = await axios(config);
    if (res != null) {
        const blob = new Blob([res.data]);
        return window.URL.createObjectURL(blob);
    }

    return null;
};

const crawlProductBasicInfo = async (url) => {
    const {data: data} = await axios.get(`${HOST}/basicinfo/?url=${url}`);
    console.log(data);
    return data;
}

export { addUser, startAnalysis, downloadCsv, processStatus, getProjectList, getAnalysisResult, getOriginalReview, getWordTrend, heartbeat, deleteUser, crawlProductBasicInfo };
