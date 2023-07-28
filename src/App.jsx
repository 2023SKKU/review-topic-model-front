import { useState } from 'react'
import styled from 'styled-components';
import ShowBasicTopics from './components/ShowBasicTopics/ShowBasicTopics'
import WordTopicChart from './components/WordTopicChart/WordTopicChart';
import ShowDTM from './components/ShowDTM/ShowDTM';
import TimeSeriesCompare from './components/TimeSeriesCompare/TimeSeriesCompare';

function App() {
    const topicList = [['맛있', '배송', '빠르', '구매', '주문', '가슴살', '다이어트', '시키', '만족', '감사'],
    ['소스', '소세지', '샐러드', '안전', '저녁', '간식', '맛있', '소시지', '아이', '가슴살'],
    ['종류', '리뷰', '질리', '구매', '맛있', '소스', '크리스', '가격', '대비', '입맛'],
    ['만두', '최고', '아임닭', '마트', '추천', '구매', '시키', '찌우', '맛있', '가슴살']];
    return (
        <>
            <Wrapper>
                <SectionDivier>
                    <ShowBasicTopics topicList={topicList}/>
                </SectionDivier>
                <SectionDivier>
                    <ShowDTM></ShowDTM>
                </SectionDivier>
                <SectionDivier>
                    <TimeSeriesCompare></TimeSeriesCompare>
                </SectionDivier>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    width: 100vw;
    background-color: #d4d6e4;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SectionDivier = styled.div`
    width: 90vw;
    height: ${(props) => props.height ? props.height+'px' : 'auto'};
    padding: 20px;
    background-color: white;
    display: flex;
    justify-content: center;
    border-radius: 20px;
    margin: 30px;
    box-shadow: 3px 3px 10px 0px grey;
`;

export default App;
