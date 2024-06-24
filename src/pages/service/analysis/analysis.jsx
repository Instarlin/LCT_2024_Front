import React, { useEffect, useState } from "react";
import { Spin, Input, Select, Button, AutoComplete } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Header } from "../../../components";
import { Link, ScrollRestoration, useLocation } from "react-router-dom";
import { LineChart, XAxis, Line, Tooltip, CartesianGrid, ResponsiveContainer, YAxis, Legend, AreaChart, Area } from "recharts";
import axios from 'axios';
import '../service.css';
import './analysis.css';

const Analysis = () => {
  const history = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('building');
  const [searchInputValue, setSearchInputValue] = useState(null);
  const [seacrhOptions, setSearchOptions] = useState([]);
  const [dataKey, setDataKey] = useState('График');
  const [data, setData] = useState([]);

  const handleRequest = async () => {
    try {
      const response = await axios.post(`http://192.144.13.15/api/predict/${selectedOption}`, {
        "searchable_value": searchInputValue,
        "alloc_id": history.state.id,
        "months_to_show": 100,
        "filter_rules": {},
      }, {
        headers: {
          "Authorization": `Bearer ${history.state.authToken}`,
        }
      });
      setDataKey(response.data[0].building);
      setData([...response.data.map(item => {return {name: item.time_period.slice(0, 7), Cost: item.price}})])
      console.log(response);
    } catch (e) {
      console.log(e);
    };
  }

  const hadleSearchChange = async (value) => {
    console.log(value)
    const res = await axios.post('http://192.144.13.15/api/predict/search', {
      "content": value,
      "alloc_id": history.state.id, 
      "search_atribute": selectedOption,
      }, {
      headers: {
        "Authorization": `Bearer ${history.state.authToken}`,
      }
    });
    setSearchOptions([...res.data.map(item => {return {value: item.content}})]);
  }

  const handleScroll = () => {
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById('headerWrapper').style.top = '-50px';
    } else {
      document.getElementById('headerWrapper').style.top = '0px';
    }
  }

  useEffect(() => {
    window.onscroll = () => handleScroll();
    setTimeout(() => setIsLoading(false), 0);
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
            <AutoComplete
              placeholder="Значение..."
              allowClear
              options={seacrhOptions}
              size="large"
              value={searchInputValue}
              style={{ width: 230 }}
              onChange={(value) => {
                setSearchInputValue(value);
                hadleSearchChange(value);
              }}
            />
          </div>
          <Select
            placeholder="Атрибут поиска..."
            style={{ width: 230 }}
            size="large"
            value={selectedOption}
            onChange={(value) => setSelectedOption(value)}
            options={[
              { value: 'building', label: 'Поиск по зданиям' },
              { value: 'main_ledger_id', label: 'Счет главной книги' },
              { value: 'fixed_assets_id', label: 'Айди основных средств' },
              { value: 'fixed_assets_class', label: 'Класс основных средств' },
            ]}
          />
          <Button type="primary" size="large" disabled={selectedOption === null ? true : false} onClick={handleRequest}>Поиск</Button>
        </div>
      </div>
      <div className={`${isLoading?'boilerPlateWrapperAnalysisLoad':'boilerPlateWrapperAnalysis'}`}>
        {isLoading?(
          <Spin indicator={<LoadingOutlined style={{ fontSize: 64, color: '#f6ffed' }} spin/>}/>
        ):(
          <>
            <ResponsiveContainer className="containerChart" height={700}>
              <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 30,
                  right: 30,
                  left: 50,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="5" />
                <XAxis dataKey="name" tickMargin={12}/>
                <YAxis />
                <Tooltip />
                <Legend height={36}/>
                <Line type="monotone" dataKey="Cost" stroke="#82ca9d" activeDot={{ r: 8 }}/>
              </LineChart>
            </ResponsiveContainer>
            {/* <ResponsiveContainer className="containerChart" height={400}>
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
            </ResponsiveContainer> */}
          </>
        )}
      </div>
    </div>
  );
};

export default Analysis;