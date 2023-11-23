// import logo from './logo.svg';
import { useState, useEffect } from 'react';
import './index.css';

export const App = () => {
  const [ value, setValue ] = useState('');
  const [ message, setMessage ] = useState(null);
  const [ previousChats, setPreviousChats ] = useState([]);
  const [ currentTitle, setCurrentTitle ] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setValue('');
    setCurrentTitle(null);
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue('');
  }
  const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();
      console.log(data);
      if (data && data.choices && data.choices[0]) {
        setMessage(data.choices[0].message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log(currentTitle, value, message);

    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }

    if (currentTitle && value && message) {
      setPreviousChats(previousChats => (
        [...previousChats,
          {
          title: currentTitle,
          role: 'user',
          content: value,
        },
        {
          role: message.role,
          content: message.content,
          title: currentTitle,
        }]
      ));
    }
  }, [message, value, currentTitle]);

  const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle);
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)));
  console.log(uniqueTitles);

  console.log(previousChats);
  return (
    <div className="app">
      <section className="sidebar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Heniu</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1> Heniu GPT </h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key="index">
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>{'>'}</div>
          </div>
          <p className="info">
            Caution! Everything you say can be hallucinated back at you.
          </p>
        </div>
      </section>
    </div>
  );
}
