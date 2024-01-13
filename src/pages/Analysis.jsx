import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import NavBar from '../components/NavBar/NavBar';
import ShowBasicTopics from '../components/ShowBasicTopics/ShowBasicTopics';
import ShowDTM from '../components/ShowDTM/ShowDTM';
import { getAnalysisResult, downloadCsv } from '../util/getData';
import TrendChart from '../components/TrendChart/TrendChart';


const Analysis = () => {
    // 일단 하드코딩
    // const dateList = ['20191230', '20200106', '20200113', '20200120', '20200127', '20200203', '20200210', '20200217', '20200224', '20200302', '20200309', '20200316', '20200323', '20200330', '20200406', '20200413', '20200420', '20200427', '20200504', '20200511', '20200518', '20200525', '20200601', '20200608', '20200615', '20200622', '20200629', '20200706', '20200713', '20200720', '20200727', '20200803', '20200810', '20200817', '20200824', '20200831', '20200907', '20200914', '20200921', '20200928', '20201005', '20201012', '20201019', '20201026', '20201102', '20201109', '20201116', '20201123', '20201130', '20201207', '20201214', '20201221', '20201228', '20210104', '20210111', '20210118', '20210125', '20210201', '20210208', '20210215', '20210222', '20210301', '20210308', '20210315', '20210322', '20210329', '20210405', '20210412', '20210419', '20210426', '20210503', '20210510', '20210517', '20210524', '20210531', '20210607', '20210614', '20210621', '20210628', '20210705', '20210712', '20210719', '20210726', '20210802', '20210809', '20210816', '20210823', '20210830', '20210906', '20210913', '20210920', '20210927', '20211004', '20211011', '20211018', '20211025', '20211101', '20211108', '20211115', '20211122', '20211129', '20211206', '20211213', '20211220', '20211227', '20220103', '20220110', '20220117', '20220124', '20220131', '20220207', '20220214', '20220221', '20220228', '20220307', '20220314', '20220321', '20220328', '20220404', '20220411', '20220418', '20220425', '20220502', '20220509', '20220516', '20220523', '20220530', '20220606', '20220613', '20220620', '20220627', '20220704', '20220711', '20220718', '20220725', '20220801', '20220808', '20220815', '20220822', '20220829', '20220905', '20220912', '20220919', '20220926', '20221003', '20221010', '20221017', '20221024', '20221031', '20221107', '20221114', '20221121', '20221128', '20221205', '20221212', '20221219', '20221226']


    const params = useParams();

    const [productName, setProductName] = useState('');
    const [filename, setFilename] = useState('');
    const [pros, setPros] = useState([]);
    const [cons, setCons] = useState([]);
    const [dtm, setDtm] = useState([]);
    const [trend, setTrend] = useState([]);
    const [dateList, setDateList] = useState([]);

    const handleGetAnalysusResult = async () => {
        const res = await getAnalysisResult(params.productid);
        if (res.success) {
            setProductName(res.p_data[0].product_name);
            setFilename(res.p_data[0].csvname);
            setPros(res.p_data[0].pros);
            setCons(res.p_data[0].cons);
            setTrend(res.p_data[0].trend);
            setDtm(res.dtm_result);
            
            const startDateStr = res.p_data[0].trend_start_date;
            const startDate = new Date(Number(startDateStr.slice(0, 4)), Number(startDateStr.slice(4, 6)), Number(startDateStr.slice(6, 8)));
            const endDateStr = res.p_data[0].trend_end_date;
            const endDate = new Date(Number(endDateStr.slice(0, 4)), Number(endDateStr.slice(4, 6))-1, Number(endDateStr.slice(6, 8)));
            let dateListTemp = [];
            while (startDate < endDate) {
                dateListTemp.push(`${startDate.getFullYear()}. ${startDate.getMonth()+1}. ${startDate.getDate()}.`);
                startDate.setDate(startDate.getDate()+7);
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
        const link = document.createElement("a");
        link.href = fileObjectUrl;
        link.style.display = "none";
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(fileObjectUrl);
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
                        <div style={{width: '100%', display: 'flex', justifyContent: 'center', height: '80%'}}>
                        {   trend.length == 0 ? <LoadingText>로딩중...</LoadingText> : <TrendChart frequency={trend} x={dateList} label="검색량 추이" />}
                        </div>
                    </GraphWrapper>
                </LeftContainer>
            </FullWrapper>
        </>
    );
}

const FullWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #F9F9F9;
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
`;

const DownloadBtn = styled.button`
    width: 150px;
    height: 30px;
    margin-left: calc(100% - 200px);
    color: white;
    background-color: #7C3EF2;
    border-radius: 8px;
    font-size: 0.8rem;
`;

const GraphWrapper = styled.div`
    width: calc(100% - 50px);
    height: 570px;
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

export default Analysis;