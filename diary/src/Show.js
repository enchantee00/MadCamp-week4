import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import headerImage from './logo.png';
import './Show.css';

const get_diary = async (uid) => {
    const response = await fetch(`http://172.10.5.46:80/read/${uid}`, {
        method: 'GET'
    });

    const data = await response.json();
    const resp = data.diaries.map(entry => ({
        created_at: entry.created_at,
        type: entry.type,
        content: entry.type === 'chat' ? JSON.stringify(entry.summary.output) : JSON.stringify(entry.content),
        id: entry.id,
        color: `rgba(${entry.color[0]}, ${entry.color[1]}, ${entry.color[2]}, 0.7)`
    }));

    resp.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return resp;
}

const rmtrans = (rgba) => {
    const rgbaRegex = /^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d*)?\s*\)$/;
    const match = rgba.match(rgbaRegex);

    if (!match) {
        throw new Error("Invalid RGBA color string");
    }

    const r = match[1];
    const g = match[2];
    const b = match[3];
    
    // Return the RGB string
    return `rgb(${r}, ${g}, ${b})`;
}

const Show = () => {
    const location = useLocation();
    const userId = location.state?.userId;
    const navigate = useNavigate();
    const [diaryData, setDiaryData] = useState([]);
    const [modalContent, setModalContent] = useState(null);


    const handleLogoClick = () => {
        navigate('/main', { state: { userId } });
    };

    const handleGridItemClick = (entry) => {
        setModalContent(entry);
    };

    const handleCloseModal = () => {
        setModalContent(null);
    };

    const handleDelete = async (id) => {
        await fetch(`http://172.10.5.46:80/delete/${id}`, { method: 'DELETE' });
        setDiaryData(diaryData.filter(entry => entry.id !== id));
        handleCloseModal();
    };

    const handleEdit = (entry) => {
        if(entry.type == 'chat'){
            console.log('show->chat', entry.id, userId);
            navigate('/Chatlog', {state : {diaryId: entry.id, userId : userId}});
        }
        else{
            navigate('/edit', { state: { diaryId: entry.id, content : entry.content } });
        }
    };

    useEffect(() => {
        const fetchDiary = async () => {
            const tmp = await get_diary(userId);
            setDiaryData(tmp);
        };

        fetchDiary();
    }, [userId]);

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

            <div className="Main-body">
                <div className="grid-container">
                    {diaryData.map((entry, index) => (
                        <div 
                            key={index} 
                            className="grid-item" 
                            style={{
                                backgroundImage: `linear-gradient(to top, ${entry.color}, ${entry.color})`
                            }}
                            onClick={() => handleGridItemClick(entry)}
                        >
                            <h3>{entry.created_at}</h3>
                            <p>{entry.content}</p>
                        </div>
                    ))}
                </div>
            </div>
            {modalContent && (
                <div className="modal" style={{ display: 'block'}}>
                    <div className="cover">
                        <div className="modal-content" style={{ backgroundColor: rmtrans(modalContent.color) }}>
                            <span className="close" onClick={handleCloseModal}>&times;</span>
                            <h3>{modalContent.created_at}</h3>
                            <p>{modalContent.content}</p>
                            <div className="modal-buttons">
                                <button onClick={() => handleDelete(modalContent.id)} className="modal-button">Delete</button>
                                <button onClick={() => handleEdit(modalContent)} className="modal-button">Edit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Show;
