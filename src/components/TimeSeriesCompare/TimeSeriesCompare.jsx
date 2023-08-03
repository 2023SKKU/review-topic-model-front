import React, { useState, useEffect } from 'react';
import { wordTfidf } from '../../data/wordTfidfResult';
import {
    pearsonCorrelation,
    getTopicFrequencySeries,
    getTopicClusterSize,
    getMonthList,
} from '../../util/calcWordSeriesScore';
import WordTopicChart from '../WordTopicChart/WordTopicChart';
import styled from 'styled-components';

const TimeSeriesCompare = () => {
    const nTopic = 5;
    const [wordRank, setWordRank] = useState({});
    const [monthList, setMonthList] = useState([]);
    const [wordList, setWordList] = useState([]);
    const [chosenWord, setChosenWord] = useState('');
    const [chosenIndex, setChosenIndex] = useState(0);
    const [frequencyList, setFrequencyList] = useState([]);

    const extractTopSimWord = async () => {
        let freqList = getTopicFrequencySeries(nTopic);
        let topicSizes = getTopicClusterSize(nTopic);
        let sizeSum = topicSizes.reduce((accumulator, current) => accumulator + current, 0);
        let result = {};
        for (let i = 0; i < nTopic - 1; i++) {
            for (let word in wordTfidf[i]) {
                if (!(word in result)) {
                    result[word] =
                        pearsonCorrelation(wordTfidf[i][word], freqList[i]) *
                        (Math.sqrt(topicSizes[i] / sizeSum) + 1);
                } else {
                    result[word] +=
                        pearsonCorrelation(wordTfidf[i][word], freqList[i]) *
                        (Math.sqrt(topicSizes[i] / sizeSum) + 1);
                }
            }
        }
        let sorted = Object.entries(result)
            .sort(([, a], [, b]) => b - a)
            .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});


        await setWordRank(sorted);
        await setMonthList(getMonthList());
        await setWordList(Object.keys(sorted).slice(0, 5));
        await setChosenWord(Object.keys(sorted)[0]);
        await setFrequencyList(freqList);
    };

    const changeChosenWord = (idx) => {
        console.log(wordTfidf[0][chosenWord]);
        console.log(frequencyList[0]);
        console.log(monthList);
        console.log(wordRank);
        setChosenWord(Object.keys(wordRank)[idx]);
        setChosenIndex(idx);
    };

    const getWordTfidf = (topicIdx) => {
        console.log(topicIdx, chosenWord);
        try {
            console.log(wordTfidf[topicIdx][chosenWord]);
            return wordTfidf[topicIdx][chosenWord];
        } catch {
            return new Array(monthList.length).fill(0);
        }
    };

    useEffect(() => {
        extractTopSimWord();
    }, []);

    return (
        <>
            <Wrapper>
                <Title>상품의 트렌드를 가장 잘 나타내는 단어는</Title>
                <WordWrapper>
                    {!wordList ? (
                        <div>Loading...</div>
                    ) : (
                        wordList.map((word, idx) => {
                            return (
                                <WordContainer
                                    key={idx}
                                    onClick={() => changeChosenWord(idx)}
                                    chosen={chosenIndex === idx}
                                >
                                    {word}
                                </WordContainer>
                            );
                        })
                    )}
                </WordWrapper>
                <GraphWrapper>
                    {!chosenWord ? (
                        <div>Loading...</div>
                    ) : (
                        [...Array(nTopic - 1).keys()].map((topicIdx, idx) => {
                            return (
                                <GraphContainer>
                                    <WordTopicChart
                                        wordTfidf={getWordTfidf(topicIdx)}
                                        topicFrequency={frequencyList[topicIdx]}
                                        x={monthList}
                                        topicIdx={topicIdx}
                                    />
                                </GraphContainer>
                            );
                        })
                    )}
                </GraphWrapper>
            </Wrapper>
        </>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Title = styled.div`
    font-weight: bold;
    font-size: 1.5rem;
    text-align: center;
`;

const WordContainer = styled.div`
    padding: 10px;
    border-radius: 10px;
    background-color: ${(props) => (props.chosen ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.1)')};
    margin-right: 10px;
`;

const WordWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const GraphWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
`;

const GraphContainer = styled.div`
    width: 45%;
    margin-right: 10px;
    margin-bottom: 10px;
`;

export default TimeSeriesCompare;
