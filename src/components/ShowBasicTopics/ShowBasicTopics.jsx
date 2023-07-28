import React from 'react';
import styled from 'styled-components';

const ShowBasicTopics = ({topicList}) => {
    return (
        <>
            <TopicWrapper>
                <TableTitle>닭가슴살 토픽 모델링 결과</TableTitle>
                {topicList.map((keyword_list, idx) => {
                        return (
                            <InnerTopicWrapper>
                                <TopicTitle>Topic{idx+1}</TopicTitle>
                                <TopicElement>{keyword_list.join(' ')}</TopicElement>
                            </InnerTopicWrapper>
                        );
                })}
            </TopicWrapper>
        </>
    );
}

const TableTitle = styled.div`
    font-weight: bold;
    font-size: 1.5em;
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
`;

const TopicWrapper = styled.div`
    width: 80vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const InnerTopicWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
`;

const TopicElement = styled.div`
    width: 90%;
    height: 30px;
    text-align: center;
    line-height: 30px;
    overflow-x:auto;
`;

const TopicTitle = styled.div`
    width: 10%;
    height: 30px;
    text-align: center;
    border-right: 1px solid black;
    line-height: 30px;
`;

export default ShowBasicTopics;