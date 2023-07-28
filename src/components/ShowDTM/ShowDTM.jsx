import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dummy } from '../../data/DTMResult';
import TopicPerMonth from '../TopicPerMonth/TopicPerMonth';

const ShowDTM = () => {
    const [dtmTopicData, setDtmTopicData] = useState({});
    const [monthList, setMonthList] = useState([]);
    const nTopic = 5;

    useEffect(() => {
        getTopicPerMonthData();
    }, []);

    const _inArray = (item, arr) => {
        for (let i of arr) {
            if (i == item) return true;
        }
        return false;
    };

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
                                <TopicPerMonth month={month} key={idx} topicObj={dtmTopicData} />
                            );
                        })
                    )}
                </Wrapper>
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

export default ShowDTM;
