import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('tab1');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Medium Style Web Page</h1>
      </div>
      <div className="main">
        <div className="content">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'tab1' ? 'active' : ''}`}
                onClick={() => handleTabClick('tab1')}
                role="tab"
                aria-selected={activeTab === 'tab1'}
              >
                Tab 1
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'tab2' ? 'active' : ''}`}
                onClick={() => handleTabClick('tab2')}
                role="tab"
                aria-selected={activeTab === 'tab2'}
              >
                Tab 2
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'tab3' ? 'active' : ''}`}
                onClick={() => handleTabClick('tab3')}
                role="tab"
                aria-selected={activeTab === 'tab3'}
              >
                Tab 3
              </a>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div className={`tab-pane fade ${activeTab === 'tab1' ? 'show active' : ''}`} role="tabpanel">
              <h2>Welcome to Tab 1</h2>
              <p>This is the content of the first tab. You can add more information here as needed.</p>
            </div>
            <div className={`tab-pane fade ${activeTab === 'tab2' ? 'show active' : ''}`} role="tabpanel">
              <h2>Welcome to Tab 2</h2>
              <p>This is the content of the second tab. You can add more information here as needed.</p>
            </div>
            <div className={`tab-pane fade ${activeTab === 'tab3' ? 'show active' : ''}`} role="tabpanel">
              <h2>Welcome to Tab 3</h2>
              <p>This is the content of the third tab. You can add more information here as needed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
