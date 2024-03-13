import React, { useState, useEffect } from 'react';
import Spinner from './spinner';
import { MdDelete } from "react-icons/md";
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [newUser, setNewUser] = useState('');
  const [password, setPassword] = useState('');
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isThereSession, setIsThereSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState([]);
  const [loggedToDo, setLoggedToDo] = useState(false);

  useEffect(() => {
    setCredentials({ username: username, password: password });
  }, [username, password]);

  const login = async () => {
    setIsLoading(true);
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), 3000);
    });
    setIsThereSession(credentials.username && credentials.password);
    setIsLoading(false);
    setLoggedToDo(true);
    setNewUser();
    await obtenerInfoServer();
  };
  const SERVER_URL =
    'https://playground.4geeks.com/apis/fake/todos/user/';
  const GET_HTTP_METHOD = 'GET';
  const PUT_HTTP_METHOD = 'PUT';
  const POST_HTTP_METHOD = 'POST';
  

  const obtenerInfoServer = async () => {
    const response = await fetch(`${SERVER_URL}${username}`, { method: GET_HTTP_METHOD });
    const data = await response.json();
    setList(data);
  };
  const createNewuser = async () => {
    await fetch(`${SERVER_URL}${username}`, {
      method: POST_HTTP_METHOD,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([]),
    });
    await obtenerInfoServer();
  };

  
  
  const createNewTodo = async (label) => {
    const newTodo = { label, id: '', done: false };
    const state = [...list, newTodo];
    await fetch(`${SERVER_URL}${username}`, {
      method: PUT_HTTP_METHOD,
      body: JSON.stringify(state),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await obtenerInfoServer();
  };
  const deleteTodo = async (label) => {
    const updatedList = list.filter((todo) => todo.label !== label);
    await fetch(`${SERVER_URL}${username}`, {
      method: PUT_HTTP_METHOD,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedList),
    });
    await obtenerInfoServer();
  };

  useEffect(() => {
    obtenerInfoServer();
  }, []);

  return(
    <>
      <div className="app__container">
        <div className="login-container">
          {!isLoading && !loggedToDo && (
            <>
              <input className="input_loguin"
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input className="input_loguin"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="signin-button" onClick={() => 
                login()
                }>
                Sign in
              </button>
              <input className="input_loguin"
                type="text"
                placeholder="New User"
                onChange={(e) => setUsername(e.target.value)}
              />
              <button className="signin-button" onClick={() =>{
                createNewuser();
                login();
              }}>
                Create New User
                  </button>
            </>
          )}
          {isLoading && !loggedToDo && (
            <>
              <Spinner />
            </>
          )}

          {loggedToDo && (
            <>
              <div className="todolist-container">
                <h1>Todos</h1>
                <ul>
                  <li>
                    <input className="input_todo"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          createNewTodo(inputValue);
                          setInputValue('');
                        }
                      }}
                      placeholder="What do you need to do?"
                    />
                  </li>
                  {list.map(({ id, done, label }) => (
                    <li key={id}>
                      {label}{' '}
                      <button
                        className="button_todo"
                        onClick={() => deleteTodo(label)}
                      >
                       <MdDelete />
                      </button>
                    </li>
                  ))}
                  <li>{list.length} items left</li>
                </ul>
                <button className='logout-button' onClick={() => 
                  {
                    setIsLoading(false);
                    setLoggedToDo(false);
                    }}><svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                    <span>Logout</span></button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
  }

export default App;
