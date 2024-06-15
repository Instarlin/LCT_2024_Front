import { Header } from '../../components/';
import { Link } from 'react-router-dom';
import './registration.css';
import { useEffect, useState } from 'react';

const Registration = () => {
  const [state, setState] = useState(false);

  const handleClick = () => setState(!state);

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
    console.log(current%3, next%3, prev%3)

    slides[current%3].classList.add('active');
    slides[prev%3].classList.add('prev');
    slides[next%3].classList.add('next');
    console.log(prev%3, current%3, next%3)
    setTimeout(handleSlider, 3200);
  };

  useEffect(handleSlider, []);

  return (
    <div className="regWrapper">
      <Header/>
      <div className="registrationBody">
        <div className="mainForm">
          <div className="formWrapper">
            <div className="leftFormWrapper">
              {state?<Link onClick={handleClick}>Зарегистрирутейсь</Link>:
                <>
                  <h1>Login</h1>
                  <input placeholder="Login..."/>
                  <input  placeholder="Password..." type="password"/>
                  <Link>Забыли пароль?</Link>
                  <Link style={{textDecoration: 'none'}} to={"/service/distribution"} className="btn">Login</Link>
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
                <div id="img3" className="item counting prev"><h2>Контроль 2</h2></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;