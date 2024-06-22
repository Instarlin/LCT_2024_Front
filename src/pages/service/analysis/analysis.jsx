import React, { useEffect, useState } from "react";
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Header } from "../../../components";
import { Link, ScrollRestoration, useLocation } from "react-router-dom";
import { LineChart, XAxis, Line, Tooltip, CartesianGrid  } from "recharts";
import '../service.css';
import './analysis.css';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];


const Analysis = () => {
  const authToken = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const handleScroll = () => {
    if(document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      document.getElementById('headerWrapper').style.top = '-50px';
    } else {
      document.getElementById('headerWrapper').style.top = '0px';
    }
  }

  useEffect(() => {
    window.onscroll = () => handleScroll();
    setTimeout(() => setIsLoading(false), 2000);
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
        {isLoading?(
          <Spin indicator={<LoadingOutlined style={{ fontSize: 64, color: '#f6ffed' }} spin/>}/>
        ):(
          <LineChart width={400} height={400} data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <XAxis dataKey="name" />
          <Tooltip />
          <CartesianGrid stroke="#f5f5f5" />
          <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} />
          <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} />
        </LineChart>
        )}
        
      </div>
    </div>
  );
};

export default Analysis;