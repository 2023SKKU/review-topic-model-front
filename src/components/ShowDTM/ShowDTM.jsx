import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TopicPerMonth from '../TopicPerMonth/TopicPerMonth';
import ArrowIcon from '../../assets/next.svg?react';
import { getOriginalReview, getWordTrend } from '../../util/getData';
import WordTopicChart from '../WordTopicChart/WordTopicChart';

const ShowDTM = ({ productID, dtmResult }) => {
    const [dtmTopicData, setDtmTopicData] = useState({});
    const [monthList, setMonthList] = useState([]);
    const [chosenWord, setChosenWord] = useState('');
    const [chosenTopic, setChosenTopic] = useState(0);
    const [chosenMonth, setChosenMonth] = useState('');
    const [originalReviewList, setOriginalReviewList] = useState([]);
    const [nowSentPage, setNowSentPage] = useState(0);
    const [timestampIdx, setTimestampIdx] = useState(0);
    const [infoMode, setInfoMode] = useState(0);
    const [wordFrequency, setWordFrequency] = useState([]);
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

    const getTopicPerMonthData = () => {
        let tempObj = {};
        let tempMonthList = [];
        for (let obj of dtmResult) {
            if (_inArray(obj.month, tempMonthList)) {
                tempObj[obj.month].push(obj.words);
            } else {
                tempMonthList.push(obj.month);
                tempObj[obj.month] = [];
                if (obj.topic == -1) continue;
                tempObj[obj.month].push(obj.words);
            }
        }
        setDtmTopicData(tempObj);
        setMonthList(tempMonthList);
    };

    useEffect(() => {
        getTopicPerMonthData();
    }, [dtmResult]);

    const nextPage = () => {
        if (nowSentPage+1 >= Math.ceil(originalReviewList.length/5)) {
            return;
        };
        setNowSentPage(nowSentPage+1);
    }

    const prevPage = () => {
        if (nowSentPage <= 0) {
            return;
        };
        setNowSentPage(nowSentPage-1);
    }

    const nextMonth = () => {
        if (timestampIdx + 1 >= monthList.length) return;
        setTimestampIdx(timestampIdx + 1);
    };

    const prevMonth = () => {
        if (timestampIdx - 1 < 0) return;
        setTimestampIdx(timestampIdx - 1);
    };

    const handleOriginalReview = async () => {
        if (chosenWord == '') return;
        const data = await getOriginalReview(productID, chosenWord);
        console.log('asdf', data);
        if (data.success) {
            let tempList = [];
            for (let item of data.reviews) {
                tempList.push(item.document);
            }
            setOriginalReviewList(tempList);
            setNowSentPage(0);
        }
    };

    const handleGetTrend = async () => {
        if (chosenWord == '') return;
        const data = await getWordTrend(productID, chosenWord);
        if (data.success) {
            let tempList = [];
            for (let val of data.trend) {
                tempList.push(val.cnt);
            }
            setWordFrequency(tempList);
        }
    }

    useEffect(() => {
        if (infoMode == 0) {
            setOriginalReviewList([]);
            handleOriginalReview();
        } else {
            handleGetTrend();
        }
    }, [chosenWord, infoMode]);

    const changeInfoMode = async (num) => {
        if (infoMode == num) return;
        setInfoMode(num);
    };

    return (
        <>
            <Wrapper>
                <DTMWrapper>
                    <ArrowIcon
                        width={50}
                        height={50}
                        transform="rotate(180)"
                        fill={timestampIdx == 0 ? 'grey' : 'black'}
                        onClick={prevMonth}
                        style={{ cursor: 'pointer' }}
                    />
                    {dtmResult.length == 0 ? (
                        <></>
                    ) : (
                        <TopicPerMonth
                            month={monthList[timestampIdx]}
                            topicObj={dtmTopicData}
                            onChange={changeChosenWord}
                            chosenWord={chosenWord}
                            chosenTopic={chosenTopic}
                            chosenMonth={chosenMonth}
                        />
                    )}
                    <ArrowIcon
                        width={50}
                        height={50}
                        transform="rotate(0)"
                        fill={timestampIdx == monthList.length - 1 ? 'grey' : 'black'}
                        onClick={nextMonth}
                        style={{ cursor: 'pointer' }}
                    />
                </DTMWrapper>
                <InfoWrapper>
                    <BtnWrapper>
                        <InfoModeBtn chosen={infoMode == 0} onClick={() => changeInfoMode(0)}>
                            리뷰 원본
                        </InfoModeBtn>
                        <InfoModeBtn chosen={infoMode == 1} onClick={() => changeInfoMode(1)}>
                            빈도 그래프
                        </InfoModeBtn>
                    </BtnWrapper>
                    {infoMode == 0 ? (<ReviewLayoutWrapper>
                        <ArrowIcon
                            width={50}
                            height={50}
                            transform="rotate(180)"
                            fill={nowSentPage == 0 ? 'grey' : 'black'}
                            onClick={prevPage}
                            style={{ cursor: 'pointer' }}
                        />
                        {chosenWord == '' ? (
                            <LoadingText>왼쪽에서 단어를 선택해보세요!</LoadingText>
                        ) : (
                            <ReviewsWrapper>
                                {originalReviewList.length == 0 ? (
                                    <></>
                                ) : (
                                    originalReviewList
                                        .slice(nowSentPage, nowSentPage + 5)
                                        .map((item, idx) => {
                                            return <ReviewElement key={idx}>{item}</ReviewElement>;
                                        })
                                )}
                            </ReviewsWrapper>
                        )}
                        <ArrowIcon
                            width={50}
                            height={50}
                            transform="rotate(0)"
                            fill={nowSentPage+1 >= Math.ceil(originalReviewList.length/5) ? 'grey' : 'black'}
                            onClick={nextPage}
                            style={{ cursor: 'pointer' }}
                        />
                    </ReviewLayoutWrapper>) : (
                        <div style={{width: '100%', display: 'flex', justifyContent: 'center', height: '90%'}}>
                        {wordFrequency.length == 0 ? <LoadingText>로딩중...</LoadingText> : <WordTopicChart frequency={wordFrequency} x={monthList} label="월별 등장 빈도수" />}
                        </div>
                    )}
                </InfoWrapper>
            </Wrapper>
        </>
    );
};

const Wrapper = styled.div`
    width: calc(100% - 50px);
    display: flex;
`;

const DTMWrapper = styled.div`
    width: 45%;
    height: 300px;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 50px;
`;

const ReviewLayoutWrapper = styled.div`
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 50px;
    margin-top: -13px;
`;

const InfoWrapper = styled.div`
    width: calc(55% - 10px);
    height: 300px;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
    margin-left: 10px;
    padding-bottom: 50px;
`;

const BtnWrapper = styled.div`
    display: flex;
    margin-top: 30px;
    margin-left: 30px;
`;

const InfoModeBtn = styled.div`
    width: 100px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: ${(props) => (props.chosen ? 'white' : '#7C3EF2')};
    background-color: ${(props) => (props.chosen ? '#7C3EF2' : 'white')};
    border-radius: 8px;
    font-size: 0.8rem;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
    margin-right: 10px;
    cursor: pointer;
`;

const ReviewsWrapper = styled.div`
    width: 80%;
    height: 250px;
    display: flex;
    flex-wrap: nowrap;
    flex-grow: 0;
    flex-shrink: 0;
    flex-direction: column;
`;

const ReviewElement = styled.div`
    width: 90%;
    box-sizing: border-box;
    border-bottom: 1px solid black;
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    padding-right: 10px;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    align-items: center;
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

const LoadingText = styled.div`
    width: 100%;
    height: 240px;
    font-size: 1.2rem;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.5);
    text-align: center;
    line-height: 240px;
`;

export default ShowDTM;
