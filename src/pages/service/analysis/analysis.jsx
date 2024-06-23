import React, { useEffect, useState } from "react";
import { Spin, Input, Select, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Header } from "../../../components";
import { Link, ScrollRestoration, useLocation } from "react-router-dom";
import { LineChart, XAxis, Line, Tooltip, CartesianGrid, ResponsiveContainer, YAxis, Legend, AreaChart, Area } from "recharts";
const { Search } = Input;
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
  const history = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedoption] = useState('');

  const handleScroll = () => {
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById('headerWrapper').style.top = '-50px';
    } else {
      document.getElementById('headerWrapper').style.top = '0px';
    }
  }

  useEffect(() => {
    window.onscroll = () => handleScroll();
    setTimeout(() => setIsLoading(false), 800);
  }, [])

  return (
    <div className="analysisWrapper">
      <ScrollRestoration />
      <div id="headerWrapper">
        <Header/>
        <div className="boilerPlateHeader">
            <Link style={{textDecoration: "none"}} className="headerLink" to={"/service/distribution"} state={{authToken: history.state.authToken}}>Распределения</Link>
            <Link style={{textDecoration: "none"}} className="headerLink selected" to={"./"}>Анализ</Link>
        </div>
        <div className="boilerPlateHeader searchHeader">
          <div className="searchWrapper">
            <Input
              placeholder="Счет главной книги"
              allowClear
              size="large"
            />
          </div>
          <Select
            placeholder="Поиск..."
            style={{ width: 220 }}
            size="large"
            value={selectedOption}
            options={[
              { value: 'building', label: 'Поиск по зданим' },
              { value: 'main_ledger_id', label: 'Счет главной книги' },
              { value: 'fixed_assets_id', label: 'Айди основных средств' },
              { value: 'fixed_assets_class', label: 'Класс основных средств' },
            ]}
          />
          <Button type="primary" size="large">Поиск</Button>
        </div>
      </div>
      <div className={`${isLoading?'boilerPlateWrapperAnalysisLoad':'boilerPlateWrapperAnalysis'}`}>
        {isLoading?(
          <Spin indicator={<LoadingOutlined style={{ fontSize: 64, color: '#f6ffed' }} spin/>}/>
        ):(
          <>
            <ResponsiveContainer className="containerChart" height={400}>
              <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer className="containerChart" height={400}>
              <AreaChart
                width={500}
                height={400}
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
};

export default Analysis;