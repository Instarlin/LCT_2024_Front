import { Header } from '../../components/';
import { Link, useNavigate } from 'react-router-dom';
import './registration.css';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import axios from 'axios';

const Registration = () => {
  const [newState, setNewState] = useState(false);
  const [login, setLogin] = useState('');
  const [fisrtPass, setFisrtPass] = useState('');
  const [secondPass, setSecondPass] = useState('');
  const navigate = useNavigate();

  const handleClick = () => setNewState(!newState);

  let current = 0, next = 1, prev = 2;
  const handleSlider = () => {
    const slides = document.querySelectorAll('.item');
    for(let i = 0; i < slides.length; i++) {
      slides[i].classList.remove("active");
      slides[i].classList.remove("prev");
      slides[i].classList.remove('next');
    };

    current += 1; 
    next += 1;
    prev += 1;

    slides[current%3].classList.add('active');
    slides[prev%3].classList.add('prev');
    slides[next%3].classList.add('next');
    setTimeout(handleSlider, 3200);
  };

  const handleUserCreation = async () => {
    try {
      if(fisrtPass === secondPass) {
        const response = await axios.post('http://192.144.13.15/api/user', {
          "email": login,
          "password": fisrtPass
        });
        message.success('Аккаунт создан');
        if(response) handleLogin();
      };
    } catch (e) {
      console.log(e);
      if(e.code === "ERR_NETWORK") {
        message.error('Нет соединения с сервером')
      } else message.error(e?.response?.data?.detail);
    }
  }

  const handleLogin = async () => {
    let userInfo = new FormData();
    userInfo.append("username", login);
    userInfo.append("password", fisrtPass);
    await axios({
      method: "post",
      url: "http://192.144.13.15/api/auth/token",
      data: userInfo,
      headers: { "Content-Type": "multipart/form-data" },
    }).then(response => {
      navigate('/service/distribution', {state: {authToken: response.data.access_token}});
      message.info('Вы вошли в аккаунт');
    }).catch((e) => {
      console.log(e);
      if(e.code === "ERR_NETWORK") {
        message.error('Нет соединения с сервером')
      } else message.error(e?.response?.data?.detail);
    })
  }

  useEffect(handleSlider, []);

  return (
    <div className="regWrapper">
      <Header/>
      <div className="registrationBody">
        <div className="mainForm">
          <div className="formWrapper">
            <div className="leftFormWrapper">
              {newState?
                <>
                  <h1>Регистрация</h1>
                  <input 
                    placeholder="e-mail..." 
                    id='emailField' 
                    value={login} 
                    onChange={e => setLogin(e.target.value)}
                    onKeyDown={e => {
                      if(e.key === 'Enter' || e.key === 'ArrowDown') {
                        document.getElementById('firstRegPassForm').focus()
                      }
                    }}
                  />
                  <input 
                    className='passwordForm' 
                    id='firstRegPassForm'
                    placeholder="Создайте пароль..." 
                    type="password" 
                    value={fisrtPass} 
                    onChange={e => setFisrtPass(e.target.value)} 
                    onKeyDown={e => {
                      if(e.key === 'Enter' || e.key === 'ArrowDown') {
                        document.getElementById('secondRegPassForm').focus()
                      } else if (e.key === 'ArrowUp') {
                        document.getElementById('emailField').focus()
                      }
                    }}
                  />
                  <input 
                    className='passwordForm' 
                    id='secondRegPassForm' 
                    placeholder="Подтвердите пароль..." 
                    type="password" 
                    value={secondPass} 
                    onChange={e => setSecondPass(e.target.value)} 
                    onKeyDown={e => {
                      if(e.key === 'Enter') {
                        handleUserCreation()
                      } else if(e.key === 'ArrowUp') {
                        document.getElementById('firstRegPassForm').focus()
                      }
                    }}
                  />
                  <div onClick={handleUserCreation}>
                    <Link style={{textDecoration: 'none'}} to={"./"} className="btn">Зарегистрироваться</Link>
                  </div>
                  <p>Есть аккаунт? <Link onClick={handleClick}>Войти</Link></p>
                </>
              :
                <>
                  <h1>Войти</h1>
                  <input 
                    placeholder="e-mail..." 
                    id='emailForm'
                    value={login} 
                    onChange={e => setLogin(e.target.value)}
                    onKeyDown={e => {
                      if(e.key === 'Enter' || e.key === 'ArrowDown') document.getElementById('passForm').focus()
                    }}
                  />
                  <input  
                    placeholder="Пароль..."
                    id='passForm'
                    type="password" 
                    value={fisrtPass}
                    onChange={e => setFisrtPass(e.target.value)} 
                    onKeyDown={e => {
                      if(e.key === 'Enter') {
                        handleLogin()
                      } else if(e.key === 'ArrowUp') {
                        document.getElementById('emailForm').focus()
                      }
                    }}
                  />
                  <Link>Забыли пароль?</Link>
                  <div onClick={handleLogin}>
                    <Link style={{textDecoration: 'none'}} to={"./"} state={{}} className="btn">Войти</Link>
                  </div>
                  <div>
                    <p>Нет аккаута? <Link onClick={handleClick}>Зарегистрируйтесь</Link></p>
                  </div>
                </>
              }
            </div>
            <div className="rightFormWrapper">
              <div className="carousel">
                <div id="img1" className="item counting prev"><h2>Контроль</h2></div>
                <div id="img2" className="item distribution active"><h2>Прогнозирование</h2></div>
                <div id="img3" className="item moving next"><h2>Распределение</h2></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;