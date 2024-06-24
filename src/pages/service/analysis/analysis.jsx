import React, { useEffect, useState } from "react";
import { Spin, Select, Button, AutoComplete, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Header } from "../../../components";
import { Link, ScrollRestoration, useLocation } from "react-router-dom";
import { LineChart, XAxis, Line, Tooltip, CartesianGrid, ResponsiveContainer, YAxis, Legend } from "recharts";
import axios from 'axios';
import '../service.css';
import './analysis.css';

const Analysis = () => {
  const history = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('building');
  const [searchInputValue, setSearchInputValue] = useState(null);
  const [seacrhOptions, setSearchOptions] = useState([]);
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
      const groupedData = {};
      response.data.forEach(entry => {
          const { building, time_period, price } = entry;
          if (!groupedData[building]) groupedData[building] = { building, data: [] };
          groupedData[building].data.push({ category: time_period.slice(0, 7), Cost: price });
      });
      const groupedArray = Object.values(groupedData);
      setData([...groupedArray]);
    } catch (e) {
      console.log(e);
    };
  }

  const hadleSearchChange = async (value) => {
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

  const checkDataState = async () => {
    try {
      const respone = await axios.post('http://192.144.13.15/api/predict/check', {
        "allocation_id": history.state.id,
      }, {
        headers: {
          "Authorization": `Bearer ${history.state.authToken}`,
        }
      });
      if(respone.data.content === "True") {
        setIsLoading(false);
        message.success('Анализ загружен');
      } else if(respone.data.content === "False") setTimeout(checkDataState, 10000);
    } catch (e) {
      console.log(e);
    }
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
    if(isLoading) checkDataState(); 
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
              <LineChart width={500} height={300} 
                margin={{
                  top: 30,
                  right: 30,
                  left: 50,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="5" />
                <XAxis dataKey="category" type="category" allowDuplicatedCategory={false} />
                <YAxis dataKey="Cost" tickMargin={12}/>
                <Tooltip />
                <Legend />
                {data.map((item) => (
                  <Line r={3} type="monotone" stroke="#006e47" dataKey="Cost" data={item.data} name={item.building} key={item.building} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
};

export default Analysis;