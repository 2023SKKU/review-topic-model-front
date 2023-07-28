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
    plugins: {
        title: {
            display: true,
            text: 'Word - Topic Frequenct Graph',
        },
    },
    scales: {
        y: {
            type: 'linear',
            display: true,
            position: 'left',
        },
        y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
                drawOnChartArea: false,
            },
        },
    },
};

const WordTopicChart = ({ wordTfidf, topicFrequency, x, topicIdx }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        setData({
            labels: x,
            datasets: [
                {
                    label: 'Word',
                    data: wordTfidf,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y',
                },
                {
                    label: `Topic${topicIdx + 1}`,
                    data: topicFrequency,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y1',
                },
            ],
        });
    }, [wordTfidf, topicFrequency, x, topicIdx]);

    return <>{!data ? <div>Loading...</div> : <Line options={options} data={data} />}</>;
};

export default WordTopicChart;
