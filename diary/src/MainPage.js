import React, { useEffect, useState } from 'react';
import './MainPage.css';
import headerImage from './logo.png'; // 이미지 파일 가져오기
import { useLocation, useNavigate } from 'react-router-dom';

function get_max_index(dict) {
    let emotion = { 공포: 0, 놀람: 1, 분노: 2, 슬픔: 3, 중립: 4, 행복: 5, 혐오: 6, 불안: 7 };
    let tmp = Object.keys(dict).reduce((a, b) => dict[a] > dict[b] ? a : b);

    return emotion[tmp];
}

const get_statics_color = async (Monthdays, uid, Month) => {
    const response = await fetch(`http://172.10.5.46:80/read/${uid}`, {
        method: 'GET'
    });

    const data = await response.json();
    console.log(data);

    const resp = data.diaries.map(entry => ({
        created_at: entry.created_at,
        emotion: entry.emotion
    }));

    console.log(resp);

    let res = Array(9).fill(0); // 예시 배열

    const monthString = `${2024}-${String(Month + 1).padStart(2, '0')}`;

    let cnt = 0;
    for (let i = 0; i < resp.length; i++) {
        if (resp[i]['created_at'].startsWith(monthString)) {
            res[get_max_index(resp[i]["emotion"])] += 1;
            cnt += 1;
        }
    }

    res[8] = Monthdays - cnt;
    console.log(res);
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

    // console.log('statics', statics);
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
    let colors = ["rgba(0, 0, 0, 0.8)", "rgba(128, 0, 128, 0.8)", "rgba(255, 0, 0, 0.8)", "rgba(0, 0, 255, 0.8)",
        "rgba(128, 128, 128, 0.8)", "rgba(255, 255, 0, 0.8)", "rgba(0, 255, 0, 0.8)", "rgba(255, 165, 0, 0.8)", "rgba(255, 255, 255, 0.8)"];

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
    console.log('getUserColors : ', uid, Month, numDays);
    const response = await fetch(`http://172.10.5.46:80/read/${uid}`, {
        method: 'GET'
    });

    const data = await response.json();

    const res = data.diaries.map(entry => ({
        created_at: entry.created_at,
        color: entry.color,
        emotion: entry.emotion
    }));
    // console.log(res);

    let colors = [];

    for (let i = 0; i < numDays; i++) {
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
    const username = location.state?.username;
    const navigate = useNavigate();

    const [showButtons, setShowButtons] = useState(false);

    const handleShowClick = () => {
        navigate('/Show', { state: { userId } });
    };

    const handleAddClick = () => {
        setShowButtons(true);
    };

    const handleCloseClick = () => {
        setShowButtons(false);
    };

    const handleButton1Click = () => {
        navigate('/Write', { state: { userId } });
    };

    const handleButton2Click = async () => {
        const response = await fetch(`http://172.10.5.46:80/start_conversation`, {
                method: 'GET'
        });
        const data = await response.json();

        navigate('/Chat', { state: {userId : userId, username: username, threadId : data['thread_id']} });
    };

    const [progress, setProgress] = useState(0);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonthDays, setCurrentMonthDays] = useState(new Date(currentYear, currentMonth, 0).getDate());
    const [colors, setColors] = useState([]);
    const [statics, setStatics] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date(currentYear, currentMonth, 1));

    useEffect(() => {
        const fetchInitialColors = async () => {
            const initialColors = await getUserColors(currentMonthDays, userId, currentMonth);
            setColors(initialColors);
            const staticsData = await get_statics_color(currentMonthDays, userId, currentMonth);
            setStatics(staticsData);
        };
        fetchInitialColors();
    }, [currentMonthDays, userId]);

    const updateColorsAndStatics = async (month, year, numDays) => {
        console.log(year, month, numDays, userId);
        const newColors = await getUserColors(numDays, userId, month);
        setColors(newColors);
        const staticsData = await get_statics_color(numDays, userId, month);
        setStatics(staticsData);
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
                <div className="header-buttons">
                    <button onClick={handleShowClick}>Show</button>
                    <button onClick={handleAddClick}>Add</button>
                </div>
            </div>
            <div className="ShowCal">
                <div className="Calendar">
                    <Calendar 
                        colors={colors} 
                        onPrevMonth={(month, year) => {
                            const prevDate = new Date(currentYear, currentMonth - 1, 1);
                            const daysInMonth = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 0).getDate();
                            setCurrentMonthDays(daysInMonth);
                            setCurrentMonth(prevDate.getMonth());
                            setCurrentYear(prevDate.getFullYear());
                            updateColorsAndStatics(prevDate.getMonth(), prevDate.getFullYear(), daysInMonth);
                        }} 
                        onNextMonth={(month, year) => {
                            const nextDate = new Date(currentYear, currentMonth + 1, 1);
                            const daysInMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
                            setCurrentMonthDays(daysInMonth);
                            setCurrentMonth(nextDate.getMonth());
                            setCurrentYear(nextDate.getFullYear());
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
            {showButtons && (
                <div className="overlay-container">
                    <h1>일기장 형식을 골라주세요</h1>
                    <div className="overlay-buttons">
                        <button className="big-button" onClick={handleButton1Click}>글로 쓰기</button>
                        <button className="big-button" onClick={handleButton2Click}>ChatBot과 같이 쓰기</button>
                    </div>
                    <button className="close-button" onClick={handleCloseClick}>Close</button>
                </div>
            )}
        </div>
    );
};

export default MainPage;
