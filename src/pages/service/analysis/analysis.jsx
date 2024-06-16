import React, { useEffect } from "react";
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Header } from "../../../components";
import { Link, ScrollRestoration, useLocation } from "react-router-dom";
import '../service.css';
import './analysis.css';

const Analysis = () => {
  const authToken = useLocation();

  const handleScroll = () => {
    if(document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      document.getElementById('headerWrapper').style.top = '-50px';
    } else {
      document.getElementById('headerWrapper').style.top = '0px';
    }
  }

  useEffect(() => {
    window.onscroll =() => handleScroll();
  }, [])

  return (
    <div className="analysisWrapper">
      <ScrollRestoration />
      <div id="headerWrapper">
        <Header/>
        <div className="boilerPlateHeader">
            <Link style={{textDecoration: "none"}} className="headerLink" to={"/service/distribution"} state={{authToken: authToken.state.authToken}}>Распределения</Link>
            <Link style={{textDecoration: "none"}} className="headerLink selected" to={"./"}>Анализ</Link>
        </div>
      </div>
      <div className="boilerPlateWrapper boilerPlateWrapperAnalysis">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 64, color: '#f6ffed' }} spin/>}/>
      </div>
    </div>
  );
};

export default Analysis;