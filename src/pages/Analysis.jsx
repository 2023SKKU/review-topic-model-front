import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import NavBar from '../components/NavBar/NavBar';
import ShowBasicTopics from '../components/ShowBasicTopics/ShowBasicTopics';
import ShowDTM from '../components/ShowDTM/ShowDTM';
import { getAnalysisResult, downloadCsv } from '../util/getData';
import TrendChart from '../components/TrendChart/TrendChart';
import Checkbox from '@mui/material/Checkbox';

const Analysis = () => {
    const params = useParams();

    const [productName, setProductName] = useState('');
    const [filename, setFilename] = useState('');
    const [pros, setPros] = useState([]);
    const [cons, setCons] = useState([]);
    const [dtm, setDtm] = useState([]);
    const [trend, setTrend] = useState([]);
    const [dateList, setDateList] = useState([]);
    const [trendWarning, setTrendWarning] = useState(false);
    const [forecastCheck, setForecastCheck] = useState(false);

    const handleGetAnalysusResult = async () => {
        const res = await getAnalysisResult(params.productid);
        if (res.success) {
            setProductName(res.p_data[0].product_name);
            setFilename(res.p_data[0].csvname);
            setPros(res.p_data[0].pros);
            setCons(res.p_data[0].cons);
            setTrend([res.p_data[0].trend, res.decomposed_trend, res.decomposed_seasonal]);
            setTrendWarning(res.p_data[0].trend_warning);
            setDtm(res.dtm_result);

            const startDateStr = res.p_data[0].trend_start_date;
            const startDate = new Date(
                Number(startDateStr.slice(0, 4)),
                Number(startDateStr.slice(4, 6)),
                Number(startDateStr.slice(6, 8))
            );

            let dateListTemp = [];
            let i = 0;
            while (i < res.p_data[0].trend.length) {
                dateListTemp.push(
                    `${startDate.getFullYear()}. ${
                        startDate.getMonth() + 1
                    }. ${startDate.getDate()}.`
                );
                startDate.setDate(startDate.getDate() + 7);
                i += 1;
            }
            setDateList(dateListTemp);
        }
    };

    useEffect(() => {
        handleGetAnalysusResult();
    }, []);

    const handleDownload = async () => {
        console.log(filename);
        const fileObjectUrl = await downloadCsv(filename);
        if (fileObjectUrl == null) {
            alert('파일에 문제가 발생하여 다운로드할 수 없습니다.');
            return;
        }
        const link = document.createElement('a');
        link.href = fileObjectUrl;
        link.style.display = 'none';
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(fileObjectUrl);
    };

    const handleForecastCheck = () => {
        setForecastCheck(!forecastCheck);
        console.log(forecastCheck);
    };

    return (
        <>
            <FullWrapper>
                <NavBar chosenIdx={1} />
                <LeftContainer>
                    <TitleText>'{productName}' 상품의 분석 결과입니다.</TitleText>
                    <DownloadBtn onClick={handleDownload}>데이터 다운로드 (.csv)</DownloadBtn>
                    <ShowBasicTopics prosList={pros} consList={cons} />
                    <ShowDTM productID={params.productid} dtmResult={dtm} />
                    <GraphWrapper>
                        <GraphText>트렌드 예측 그래프</GraphText>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <div>트렌드 예측 결과 포함</div>
                            <Checkbox checked={forecastCheck} onChange={handleForecastCheck} />
                        </div>
                        {trendWarning ? (
                            <SmallLoadingText>
                                ※ 지난 3개년 간의 검색량이 부족하여 예측의 정확도가 매우 낮을 수
                                있습니다.
                            </SmallLoadingText>
                        ) : (
                            <></>
                        )}
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                height: '80%',
                            }}
                        >
                            {trend.length == 0 ? (
                                <LoadingText>로딩중...</LoadingText>
                            ) : trend[0] === -1 ? (
                                <LoadingText>트렌드 예측이 수행되지 않았습니다.</LoadingText>
                            ) : (
                                <TrendChart
                                    frequency={trend}
                                    x={dateList}
                                    label="검색량 추이"
                                    forecastCheck={forecastCheck}
                                />
                            )}
                        </div>
                    </GraphWrapper>
                </LeftContainer>
            </FullWrapper>
        </>
    );
};

const FullWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #f9f9f9;
    display: flex;
    overflow-y: auto;
`;

const LeftContainer = styled.div`
    width: 80%;
    margin-left: calc(280px + 3%);
`;

const TitleText = styled.div`
    font-size: 2rem;
    font-weight: bold;
    margin-top: 50px;
`;

const GraphText = styled.div`
    font-size: 1.75rem;
    font-weight: bold;
    margin-top: 50px;
    overflow-x: auto;
`;

const DownloadBtn = styled.button`
    width: 150px;
    height: 30px;
    margin-left: calc(100% - 200px);
    color: white;
    background-color: #7c3ef2;
    border-radius: 8px;
    font-size: 0.8rem;
`;

const GraphWrapper = styled.div`
    width: calc(100% - 50px);
    height: 650px;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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

const SmallLoadingText = styled.div`
    font-size: 1rem;
    color: rgba(255, 0, 0, 0.5);
    text-align: center;
`;

export default Analysis;
