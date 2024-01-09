import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NavBar from '../components/NavBar/NavBar';
import { getProjectList } from '../util/getData';
import { Link } from 'react-router-dom';

const List = () => {

    const [projectList, setProjectList] = useState([]);

    const handleGetProjectList = async () => {
        const list = await getProjectList();
        if (list.success) {
            setProjectList(list.list);
            console.log('list', list);
        }
    }

    useEffect(() => {
        handleGetProjectList();
    }, []);

    return (
        <>
            <FullWrapper>
                <NavBar chosenIdx={1} />
                <LeftContainer>
                    <TitleText>프로젝트의 분석 결과를 확인하세요</TitleText>
                    <WhiteContainer>
                        <TableTitleWrapper>
                            <ID>id</ID>
                            <ProjectName>프로젝트 이름</ProjectName>
                        </TableTitleWrapper>
                        {projectList == undefined ? <LoadingText /> : projectList.map((info, idx) => {
                            return (
                                <ItemWrapper key={idx} to={`/analysis/${info.id}`}>
                                    <ID>{info.id}</ID>
                                    <ProjectName>{info.project_name}</ProjectName>
                                </ItemWrapper>
                            );
                        })}
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
    margin-left: 50px;
    margin-left: calc(280px + 3%);
`;

const TitleText = styled.div`
    font-size: 2rem;
    font-weight: bold;
    margin-top: 200px;
    margin-bottom: 20px;
`;

const WhiteContainer = styled.div`
    width: calc(100% - 50px);
    /* height: 400px; */
    background-color: white;
    border-radius: 20px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const LoadingText = styled.div`
    width: 100%;
    height: 370px;
    font-size: 1.2rem;
    font-weight: bold;
    color: #f9f9f9;
    text-align: center;
    line-height: 370px;
`;


const TableTitleWrapper = styled.div`
    width: 95%;
    height: 30px;
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    border-bottom: 2px solid black;
`;

const ItemWrapper = styled(Link)`
    width: 95%;
    height: 50px;
    line-height: 50px;
    font-size: 1rem;
    color: black;
    display: flex;
    border-bottom: 1px solid black;
    &:hover {
        background-color: #F9F9F9;
    }
`;

const ID = styled.div`
    width: 30%;
    text-align: center;
`;

const ProjectName = styled.div`
    width: 70%;
    text-align: center;
`;


export default List;