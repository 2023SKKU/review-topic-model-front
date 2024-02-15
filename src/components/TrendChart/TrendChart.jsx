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
            max: 100,
        },
        y1: {
            type: 'linear',
            display: false,
            position: 'right',
            min: -20,
            max: 20,
        },
    },
};

const WordTopicChart = ({ frequency, x, label, forecastCheck }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        console.log(frequency);
        setData({
            labels: forecastCheck ? x : x.slice(0, 157),
            datasets: [
                {
                    label: label,
                    data: forecastCheck ? frequency[0] : frequency[0].slice(0, 157),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y',
                },
                {
                    label: '전체 트렌드',
                    data: forecastCheck ? frequency[1] : frequency[1].slice(0, 157),
                    borderColor: 'rgb(235, 235, 53)',
                    backgroundColor: 'rgba(159, 235, 53, 0.5)',
                    yAxisID: 'y',
                },
            ],
        });
    }, [frequency, x, forecastCheck]);

    return <>{!data ? <div>Loading...</div> : <Line options={options} data={data} />}</>;
};

export default WordTopicChart;
