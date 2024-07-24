import React, { useEffect, useState } from 'react';
import './MainPage.css';
import headerImage from './logo.png'; // 이미지 파일 가져오기
import { useLocation } from 'react-router-dom';

const generateRandomColors = (numDays) => {
    let colors = [];
    let color_r = [0, 128, 255, 0, 128, 255, 0, 255];
    let color_g = [0, 0, 0, 0, 128, 255, 255, 165];
    let color_b = [0, 128, 0, 255, 128, 0, 0, 0];

    for (let i = 0; i < numDays; i++) {
        const rnd = Math.floor(Math.random() * 8);
        const r = color_r[rnd];
        const g = color_g[rnd];
        const b = color_b[rnd];
        colors.push([r, g, b]);
    }
    return colors;
};

const get_statics_color = (colors) => {
    const color_to_index = [
        [0, 0, 0], [128, 0, 128], [255, 0, 0], [0, 0, 255], 
        [128, 128, 128], [255, 255, 0], [0, 255, 0], [255, 165, 0]
    ];

    let res = Array(color_to_index.length).fill(0);

    const colorToString = color => color.join(',');

    const color_to_index_strings = color_to_index.map(colorToString);

    for (let i = 0; i < colors.length; i++) {
        const colorString = colorToString(colors[i]);
        const index = color_to_index_strings.indexOf(colorString);
        if (index !== -1) {
            res[index] += 1;
        }
    }

    return res;
};

const Calendar = ({ colors = [], onPrevMonth, onNextMonth, currentDate, setCurrentDate }) => {
    const [days, setDays] = useState([]);

    useEffect(() => {
        generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
    }, [currentDate, colors]);

    const generateCalendar = (month, year) => {
        const today = new Date();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let calendarDays = [];

        for (let i = 0; i < firstDay; i++) {
            calendarDays.push({ day: '', className: '', color: '' });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            let className = '';
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                className = 'today';
            }

            const date = new Date(year, month, day);
            if (date.getDay() === 0 || date.getDay() === 6) {
                className += ' weekend';
                if (date.getDay() === 6) {
                    className += ' saturday';
                }
            }

            const color = colors[day - 1] ? `rgba(${colors[day - 1].join(',')}, 0.5)` : '';

            calendarDays.push({ day, className, color });
        }

        setDays(calendarDays);
    };

    const handlePrevMonth = () => {
        const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(prevDate);
        onPrevMonth(prevDate.getMonth(), prevDate.getFullYear());
    };

    const handleNextMonth = () => {
        const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(nextDate);
        onNextMonth(nextDate.getMonth(), nextDate.getFullYear());
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="Calendar">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>&lt;</button>
                <span>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div id="calendar">
                {dayNames.map((dayName, index) => (
                    <div key={index} className="day-name">{dayName}</div>
                ))}
                {days.map((dayObj, index) => (
                    <div key={index} className={`day ${dayObj.className}`} style={{ backgroundColor: dayObj.color }}>
                        {dayObj.day}
                    </div>
                ))}
            </div>
        </div>
    );
};

const CircularProgressBar = ({ progress, statics }) => {
    const radius = 250;
    const stroke = 150;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const len = statics.length;

    const sum = statics.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    let ratio = new Array(len);
    for (let i = 0; i < len; i++) {
        ratio[i] = statics[i] / sum;
    }

    let arc = new Array(len);
    for (let i = 0; i < len; i++) {
        arc[i] = 360 * ratio[i];
    }

    let arc_circumference = new Array(len);
    for (let i = 0; i < len; i++) {
        arc_circumference[i] = ratio[i] * circumference;
    }

    let psy = new Array(len);
    let xi = new Array(len);
    let colors = ["black", "purple", "red", "blue", "gray", "yellow", "green", "orange"];

    for (let i = 0; i < len; i++) {
        psy[i] = arc_circumference[i] / (Math.PI * 2 * normalizedRadius);
    }

    let count = 0;
    for (let i = 0; i < len; i++) {
        count += 100 * psy[i];
        xi[i] = count;
    }

    const progressOffset = new Array(len);
    for (let i = 0; i < len; i++) {
        progressOffset[i] = Math.min(Math.max(0, (-(Math.PI / 50) * normalizedRadius * (progress - xi[i]))), 2 * Math.PI * normalizedRadius * psy[i]);
    }

    const circles = new Array(len);
    count = 0;
    for (let i = 0; i < len; i++) {
        circles[i] = { stroke: `${colors[i]}`, transform: `rotate(${count} ${radius} ${radius})`, progressOffset: progressOffset[i], arcCircumference: arc_circumference[i] };
        count += arc[i];
    }

    return (
        <svg height={radius * 2} width={radius * 2}>
            <circle
                stroke="lightgrey"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <>
                {circles.map((circle, index) => (
                    <circle
                        key={index}
                        stroke={circle.stroke}
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={`${circle.arcCircumference} ${circumference}`}
                        style={{ strokeDashoffset: circle.progressOffset }}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        transform={circle.transform}
                    />
                ))}
            </>
        </svg>
    );
};

const getUserColors = async (numDays, uid, Month) => {
    const response = await fetch(`http://172.10.5.46:80/read/${uid}`, {
        method: 'GET'
    });
    
    const data = await response.json();

    const res = data.diaries.map(entry => ({
        created_at: entry.created_at,
        color: entry.color,
        emotion: entry.emotion
    }));
    console.log(res);

    let colors = [];
    let color_r = [0, 128, 255, 0, 128, 255, 0, 255];
    let color_g = [0, 0, 0, 0, 128, 255, 255, 165];
    let color_b = [0, 128, 0, 255, 128, 0, 0, 0];

    for(let i = 0 ; i < numDays; i++){
        colors.push([255, 255, 255]);
    }

    const monthString = `${2024}-${String(Month + 1).padStart(2, '0')}`;
    for (let i = 0; i < res.length; i++) {
        if (res[i]['created_at'].startsWith(monthString)) {
            const day = parseInt(res[i]['created_at'].substr(8, 2), 10) - 1;
            colors[day] = res[i]['color'];
        }
    }
    return colors;
}

const MainPage = () => {
    const handleLogoClick = () => {
        window.location.reload();
    };

    const location = useLocation();
    const userId = location.state?.userId;

    const [progress, setProgress] = useState(0);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonthDays, setCurrentMonthDays] = useState(new Date(currentYear, currentMonth + 1, 0).getDate());
    const [colors, setColors] = useState([]);
    const [statics, setStatics] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date(currentYear, currentMonth, 1));

    useEffect(() => {
        const fetchInitialColors = async () => {
            const initialColors = await getUserColors(currentMonthDays, userId, currentMonth);
            setColors(initialColors);
            setStatics(get_statics_color(initialColors));
        };
        fetchInitialColors();
    }, [currentMonthDays, userId]);

    const updateColorsAndStatics = (month, year, numDays) => {
        const newColors = generateRandomColors(numDays);
        setColors(newColors);
        setStatics(get_statics_color(newColors));
        setCurrentMonth(month);
        setCurrentYear(year);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prevProgress + 1;
            });
        }, 1); // 속도를 적절히 조정합니다.
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prevProgress + 1;
            });
        }, 1); // 속도를 적절히 조정합니다.

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="MainPage">
            <div className="Main-header">
                <img 
                    src={headerImage}
                    alt="Logo" 
                    className="header-image" 
                    onClick={handleLogoClick} 
                    style={{ cursor: 'pointer' }} 
                />
            </div>
            <div className="ShowCal">
                <div className="Calendar">
                    <Calendar 
                        colors={colors} 
                        onPrevMonth={(month, year) => {
                            const prevDate = new Date(currentYear, currentMonth - 1, 1);
                            const daysInMonth = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 0).getDate();
                            setCurrentMonthDays(daysInMonth);
                            updateColorsAndStatics(prevDate.getMonth(), prevDate.getFullYear(), daysInMonth);
                        }} 
                        onNextMonth={(month, year) => {
                            const nextDate = new Date(currentYear, currentMonth + 1, 1);
                            const daysInMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
                            setCurrentMonthDays(daysInMonth);
                            updateColorsAndStatics(nextDate.getMonth(), nextDate.getFullYear(), daysInMonth);
                        }} 
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                    />
                </div>
                <div className="Circle">
                    <CircularProgressBar progress={progress} statics={statics} />
                </div>
            </div>
        </div>
    );
};

export default MainPage;
