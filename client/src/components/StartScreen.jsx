import { useNavigate } from 'react-router-dom';
import React from 'react';


function StartScreen() {
    const navigate = useNavigate(); 

    const startChatFlow = () => {
        navigate('/chat');
      };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',                      
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#f4f4f9',
      };
  
    const titleStyle = {
      fontSize: '2.5rem',
      fontWeight: '600',
      color: '#222',
      marginBottom: '1.5rem',
    };
  
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Let's find you an internship together!</h1>
            <button className="start-chat-btn" onClick={startChatFlow}> Start Chat </button>
      </div>
    );
  }
  
  export default StartScreen;
  