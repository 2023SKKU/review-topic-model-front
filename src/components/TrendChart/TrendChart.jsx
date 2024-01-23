import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const options = {
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    stacked: false,
    scales: {
        y: {
            type: 'linear',
            display: true,
            position: 'left',
            min: 0,
            max: 100
        },
        y1: {
            type: 'linear',
            display: false,
            position: 'right',
            min: -20,
            max: 20
        },
    },
};

const WordTopicChart = ({frequency, x, label}) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        console.log(frequency);
        setData({
            labels: x,
            datasets: [
                {
                    label: label,
                    data: frequency[0],
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y',
                },
                {
                    label: '전체 트렌드',
                    data: frequency[1],
                    borderColor: 'rgb(235, 235, 53)',
                    backgroundColor: 'rgba(159, 235, 53, 0.5)',
                    yAxisID: 'y',
                },
                {
                    label: '시즌성 그래프',
                    data: frequency[2],
                    borderColor: 'rgb(235, 53, 53)',
                    backgroundColor: 'rgba(235, 53, 53, 0.5)',
                    yAxisID: 'y1',
                },
            ],
        });
    }, [frequency, x]);

    return <>{!data ? <div>Loading...</div> : <Line options={options} data={data} />}</>;
};

export default WordTopicChart;
