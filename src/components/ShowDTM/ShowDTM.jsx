import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dummy } from '../../data/DTMResult';
import TopicPerMonth from '../TopicPerMonth/TopicPerMonth';
import { originalDoc } from '../../data/originalDocuments';

const ShowDTM = () => {
    const [dtmTopicData, setDtmTopicData] = useState({});
    const [monthList, setMonthList] = useState([]);
    const [chosenWord, setChosenWord] = useState('');
    const [chosenTopic, setChosenTopic] = useState(0);
    const [chosenMonth, setChosenMonth] = useState('');
    const [searchedSent, setSearchedSent] = useState([]);
    const [nowSentPage, setNowSentPage] = useState(0);
    const nTopic = 5;

    const _inArray = (item, arr) => {
        for (let i of arr) {
            if (i == item) return true;
        }
        return false;
    };

    const changeChosenWord = (word, topic, month) => {
        setChosenWord(word);
        setChosenMonth(month);
        setChosenTopic(topic);
    };

    const shuffle = (array) => {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    };

    useEffect(() => {
        getTopicPerMonthData();
    }, []);

    const searchReview = async () => {
        if (chosenWord === '') return;
        console.log(chosenWord, chosenMonth, chosenTopic);
        setSearchedSent('loading');
        let temp = [];
        for (let obj of originalDoc) {
            if (obj.Topic == chosenTopic && obj.Timestamps == chosenMonth) {
                console.log(obj);
                for (let token of obj.Tokens.split(' ')) {
                    if (token == chosenWord) {
                        temp.push(obj.Document);
                        break;
                    }
                }
            }
        }
        setSearchedSent(shuffle(temp));
        setNowSentPage(0);
    };

    useEffect(() => {
        searchReview();
    }, [chosenWord, chosenMonth, chosenTopic]);

    const getTopicPerMonthData = () => {
        let tempObj = {};
        let tempMonthList = [];
        for (let obj of dummy) {
            if (_inArray(obj.month, tempMonthList)) {
                tempObj[obj.month].push(obj.keywords);
            } else {
                tempMonthList.push(obj.month);
                tempObj[obj.month] = [];
                for (let i = 0; i < nTopic - 1; i++) {
                    if (obj.topicIdx == -1) continue;
                    tempObj[obj.month].push(obj.keywords);
                }
            }
        }
        setDtmTopicData(tempObj);
        setMonthList(tempMonthList);
    };

    const nextPage = () => {
        if (nowSentPage+1 >= Math.ceil(searchedSent.length/5)) {
            alert('마지막 페이지입니다.');
            return;
        };
        setNowSentPage(nowSentPage+1);
    }

    const prevPage = () => {
        if (nowSentPage <= 0) {
            alert('첫번째 페이지입니다.');
            return;
        };
        setNowSentPage(nowSentPage-1);
    }

    return (
        <>
            <WrapperForTitle>
                <TableTitle>월별 토픽 변화</TableTitle>
                <Wrapper>
                    {!monthList || !dtmTopicData ? (
                        <div>Loading...</div>
                    ) : (
                        monthList.map((month, idx) => {
                            return (
                                <TopicPerMonth
                                    month={month}
                                    key={idx}
                                    topicObj={dtmTopicData}
                                    chosenWord={chosenWord}
                                    chosenTopic={chosenTopic}
                                    chosenMonth={chosenMonth}
                                    changeChosenWord={changeChosenWord}
                                />
                            );
                        })
                    )}
                </Wrapper>
                <OriginalDocumentWrapper>
                    {searchedSent == 'loading' ? (
                        <div>Loading...</div>
                    ) : (
                        searchedSent.slice(5*nowSentPage, 5*nowSentPage+5).map((sent, idx) => {
                            return <OriginalDocument key={idx}>{sent}</OriginalDocument>;
                        })
                    )}
                </OriginalDocumentWrapper>
                <button onClick={prevPage}>이전</button>
                <button onClick={nextPage}>다음</button>
            </WrapperForTitle>
        </>
    );
};

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    overflow-x: auto;
    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    &::-webkit-scrollbar-track {
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.1);
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.2);
    }
    &::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.4);
    }
    &::-webkit-scrollbar-thumb:active {
        background: rgba(0, 0, 0, 0.9);
    }
`;

const TableTitle = styled.div`
    font-weight: bold;
    font-size: 1.5em;
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
`;

const WrapperForTitle = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const OriginalDocumentWrapper = styled.div`
    width: 100%;
    height: 500px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
`;

const OriginalDocument = styled.div`
    width: 100%;
    height: 50px;
    border-bottom: 1px solid black;
    padding: 20px;
    line-height: 50px;
`;

export default ShowDTM;
