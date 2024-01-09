import React, { useState } from 'react';
import styled from 'styled-components';
import NavBar from '../components/NavBar/NavBar';
import { startAnalysis, processStatus } from '../util/getData';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';


const Home = ({clientID, status, changeStatus}) => {

    const messages = ['리뷰를 크롤링하고 있어요', '토픽 모델링을 진행하고 있어요', 'DTM을 진행하고 있어요', '트렌드를 예측하고 있어요', '분석이 완료되었습니다.', '문제가 발생했습니다.']

    const [url, setUrl] = useState('');
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [projectName, setProjectName] = useState('');

    const onChangeUrl = (e) => {
        setUrl(e.target.value);
    };

    const onChangeProductName = (e) => {
        setProductName(e.target.value);
    };

    const onChangeCategory = (e) => {
        setCategory(e.target.value);
    };

    const onChangeProjectName = (e) => {
        setProjectName(e.target.value);
    };

    const handleStartAnalysis = () => {
        if (status === processStatus.BEFORE_START || status === processStatus.END) {
            changeStatus(1);
            startAnalysis(url, projectName, productName, category, clientID);
        }
    }

    return (
        <>
            <FullWrapper>
                <NavBar chosenIdx={0} />
                <LeftContainer>
                    <TitleText>리뷰를 수집할 상품 링크를 입력해주세요</TitleText>
                    <ul>
                        <SmallText>네이버 스마트스토어 링크만 가능해요 (smartstore.naver.com, brand.naver.com)</SmallText>
                    </ul>
                    <WhiteContainer>
                        <LinkInput onChange={onChangeUrl} value={url} placeholder='링크 입력' />
                        <PaddingUL>
                            <SmallText>한 링크 당 최대 20,000개의 리뷰가 크롤링됩니다.</SmallText>
                            <SmallText>'시작하기' 버튼을 누르면 자동으로 분석까지 진행됩니다.</SmallText>
                            <SmallText>현재 데모 버전으로 일부 키워드에 대해 분석이 진행되지 않을 수 있습니다.</SmallText>
                        </PaddingUL>
                        <NameText>상품 이름을 적어주세요</NameText><NameInput onChange={onChangeProductName} value={productName} placeholder='상품 이름' />
                        <NameText>상품 카테고리를 적어주세요</NameText><NameInput onChange={onChangeCategory} value={category} placeholder='카테고리' />
                        <NameText>분석 프로젝트 제목을 적어주세요 (이전과 중복 불가)</NameText><NameInput onChange={onChangeProjectName} value={projectName} placeholder='프로젝트 이름' />
                        <StartBtn available={status == processStatus.BEFORE_START} onClick={handleStartAnalysis}>시작하기</StartBtn>
                        <ProgressWrapper available={status != processStatus.BEFORE_START}>
                            <LinearProgress variant="determinate" value={status*20} />
                            <div style={{display: 'flex', alignItems: 'center', marginTop: '10px'}}>
                                <div style={{marginRight: '15px'}}>{messages[status-1]}</div>
                                <div style={{display: (status == processStatus.END || status == processStatus.ERROR) ? 'none' : 'block'}}><CircularProgress color="secondary" /></div>
                            </div>
                        </ProgressWrapper>
                        
                    </WhiteContainer>
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

const SmallText = styled.li`
    &::marker {
        color: #7F7F7F;
    }
    color: #7F7F7F;    
`;

const PaddingUL = styled.ul`
    margin-left: 5%;
`;

const WhiteContainer = styled.div`
    width: calc(100% - 50px);
    height: 650px;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
`;

const LinkInput = styled.input`
    width: 90%;
    height: 70px;
    margin-left: 5%;
    margin-top: 40px;
    background-color: #EEEFF3;
    border-radius: 20px;
    outline: none;
    border: none;
    font-size: 1.5rem;
    padding-left: 15px;
    font-weight: 100;
    &:focus {
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
    }
`;

const NameText = styled.div`
    font-size: 1.3rem;
    font-weight: bold;
    margin-left: 5%;
    margin-top: 30px;
`;

const NameInput = styled.input`
    width: 150px;
    height: 30px;
    margin-left: 5%;
    margin-top: 10px;
    background-color: #EEEFF3;
    border-radius: 10px;
    outline: none;
    border: none;
    font-size: 1rem;
    padding-left: 15px;
    font-weight: 100;
    &:focus {
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
    }
`;

const StartBtn = styled.button`
    width: 150px;
    height: 50px;
    margin-left: calc(100% - 190px);
    color: white;
    background-color: ${props =>props.available ? '#7C3EF2' : 'grey'};
    border-radius: 10px;
    font-size: 1.2rem;
`;

const ProgressWrapper = styled.div`
    display: ${props => props.available ? 'block' : 'none'};
    width: calc(100% - 60px);
    margin-top: 30px;
    margin-left: 30px;
    font-size: 1.2rem;
    font-weight: bold;
`;

export default Home;