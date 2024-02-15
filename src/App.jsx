import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Analysis, List } from './pages';
import { v4 } from 'uuid';
import { processStatus } from './util/getData';
import { heartbeat, deleteUser, addUser } from './util/getData';
import GlobalStyle from './components/GlobalStyle';

// export const AppContext = createContext();

let clientID = v4();

function App() {
    // const webSocket = useRef(null);
    // const wsUrl = 'ws://localhost:8000/ws/';

    // const [analysisStatus, setAnalysisStatus] = useState(processStatus.BEFORE_START);

    // const handleAddUser = async () => {
    //     await addUser(clientID);
    // }

    // useEffect(() => {
    //     // console.log(wsUrl+clientID);
    //     // if (localStorage['analysisStatus'] != undefined) {
    //     //     if (localStorage['analysisStatus'] == '5') setAnalysisStatus(0);
    //     //     else setAnalysisStatus(Number(localStorage['analysisStatus']));
    //     // }
    //     // startSocket();
    //     // clientID ??= v4();
    //     handleAddUser();
    //     const hb = setInterval(async () => {
    //         console.log('sdfg', analysisStatus);
    //         // if (analysisStatus != processtatus.BEFORE_START) {
    //             const res = await heartbeat(clientID);
    //             console.log(res);
    //             setAnalysisStatus(res);
    //         // }
    //     }, 20000);

    //     return () => {
    //         clearInterval(hb);
    //         deleteUser(clientID);
    //     };
    //   }, []);

    return (
        <>
            <GlobalStyle />
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/list" element={<List />} />
                    <Route path="/analysis/:productid" element={<Analysis />} />
                </Routes>
            </BrowserRouter>
        </>
    );
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
    height: ${(props) => (props.height ? props.height + 'px' : 'auto')};
    padding: 20px;
    background-color: white;
    display: flex;
    justify-content: center;
    border-radius: 20px;
    margin: 30px;
    box-shadow: 3px 3px 10px 0px grey;
`;

export default App;
