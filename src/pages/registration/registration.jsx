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
    if(fisrtPass === secondPass) {
      await axios.post('http://192.144.13.15/api/user', {
        "email": login,
        "password": fisrtPass
      }).then(response => {
        message.success(response.response.data.detail);
      }).catch((error) => {
        message.error(error.response.data.detail);
      })
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
      console.log(response.data.access_token)
      navigate('/service/distribution', {state: {authToken: response.data.access_token}});
      message.info('Вы вошли в аккаунт');
    }).catch((error) => {
      message.error(error.response.data.detail);
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
                  <h1>Registration</h1>
                  <input placeholder="Login..." value={login} onChange={e => setLogin(e.target.value)}/>
                  <input className='passwordForm' placeholder="Create password..." type="password" value={fisrtPass} onChange={e => setFisrtPass(e.target.value)}/>
                  <input className='passwordForm' placeholder="Confirm password..." type="password" value={secondPass} onChange={e => setSecondPass(e.target.value)}/>
                  <div onClick={handleUserCreation}>
                    <Link style={{textDecoration: 'none'}} to={"./"} className="btn">Registration</Link>
                  </div>
                  <p>Есть аккаунт? <Link onClick={handleClick}>Войти</Link></p>
                </>
              :
                <>
                  <h1>Login</h1>
                  <input placeholder="Login..." value={login} onChange={e => setLogin(e.target.value)}/>
                  <input  placeholder="Password..." type="password" value={fisrtPass} onChange={e => setFisrtPass(e.target.value)}/>
                  <Link>Забыли пароль?</Link>
                  <div onClick={handleLogin}>
                    <Link style={{textDecoration: 'none'}} to={"./"} state={{}} className="btn">Login</Link>
                  </div>
                  <div>
                    <p>Нет аккаута? <Link onClick={handleClick}>Зарегистрируйтесь</Link></p>
                  </div>
                </>
              }
            </div>
            <div className="rightFormWrapper">
              <div className="carousel">
                <div id="img1" className="item counting active"><h2>Контроль</h2></div>
                <div id="img2" className="item distribution next"><h2>Прогнозирование</h2></div>
                <div id="img3" className="item moving prev"><h2>Распределение</h2></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;