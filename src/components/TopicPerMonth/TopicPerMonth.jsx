import React from 'react';
import styled from 'styled-components';

const TopicPerMonth = ({ month, topicObj }) => {
    return (
        <>
            <MonthWrapper>
                <MonthTitle>{month}</MonthTitle>
                <KeywordsWrapper>
                    {topicObj[month].map((words, idx) => {
                        return (
                            <KeywordElement>
                                {words.split(', ').slice(0, 5).join(' ')}
                            </KeywordElement>
                        );
                    })}
                </KeywordsWrapper>
            </MonthWrapper>
        </>
    );
};

const MonthWrapper = styled.div`
    width: 300px;
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    flex-grow: 0;
    flex-shrink: 0;
    overflow-x: auto;
    flex-direction: column;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.2);
    margin-right: 10px;
`;

const MonthTitle = styled.div`
    width: 100%;
    text-align: center;
    font-weight: bold;
    border-bottom: 2px solid black;
`;

const KeywordsWrapper = styled.div`
    width: 100%;
    height: 212px;
    display: flex;
    flex-wrap: nowrap;
    flex-grow: 0;
    flex-shrink: 0;
    flex-direction: column;
`;

const KeywordElement = styled.div`
    width: auto;
    box-sizing: border-box;
    border-bottom: 1px solid black;
    height: 53px;
    line-height: 50px;
    padding-left: 10px;
    padding-right: 10px;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
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

export default TopicPerMonth;
