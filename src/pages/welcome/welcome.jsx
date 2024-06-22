import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import './welcome.css'
import { useEffect, useState } from 'react';

const Welcome = () => {
  const [isLoaded, setIsloaded] = useState(false);

  // () => document.fonts.ready.then((FontFaceSet) => {
  //   console.log(FontFaceSet)
  //   console.log(FontFaceSet.map((f) => f.status))
  // })

  const loadFonts = () => {
    document.fonts.onloadingdone = () => {
      console.log("Font loading complete");
    };
    
    (async () => {
      await document.fonts.load("16px SB Sans Text");
      await document.fonts.load("16px SB Sans Display Semibold");
      setIsloaded(true);
    })();
  }

  useEffect(() => {
    loadFonts();
  });

  return !isLoaded ? (
    <div className="wlcBody">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#f6ffed' }} spin/>}/>
    </div>
  ) : (
    <>
    <div className="wlcBody">
      <div className="wrapper">
        <div className="leftWrapper">
          <div className="topHeading">
            <h1>Сервис для распределения и расчета </h1>
            <h1>эффективности расходов</h1>
          </div>
          <div className="heading">
            <h3>Поддержка контроля и прогнозирование,</h3>
            <h3>затрат возникающих при оплате счетов</h3>
          </div>
          <Link to={"/registration"} className="btn" style={{textDecoration: 'none'}}>
            <h2 className="btnText">Приступим!</h2>
          </Link>
        </div>
        <div className="rightWrapper">
          <div className="box"/>
          <div className="boy"/>
          <div className="girl"/>
          <div className="elipse"/>
        </div>
      </div>
    </div>
    </>
  );
};

export default Welcome;