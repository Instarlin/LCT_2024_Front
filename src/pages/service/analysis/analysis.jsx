import React, { useEffect, useState } from "react";
import { Spin, Select, Button, AutoComplete, Modal, Input, message } from 'antd';
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
  const [searchInputValue, setSearchInputValue] = useState('');
  const [seacrhOptions, setSearchOptions] = useState([]);
  const [data, setData] = useState([]);
  const [noAlocID, setNoAlocID] = useState(false);
  // const [alocID, setAlocID] = useState(history.state.id);

  const handleRequest = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_PATH}/api/predict/${selectedOption}`, {
        "searchable_value": searchInputValue,
        "alloc_id": history.state.id,
        "months_to_show": 100,
        "filter_rules": {},
      }, {
        headers: {
          "Authorization": `Bearer ${history.state.authToken}`,
        }
      });
      console.log(response)
      const groupedData = {};
      response.data.forEach(entry => {
          const { building, time_period, price } = entry;
          if (!groupedData[building]) groupedData[building] = { building, data: [] };
          groupedData[building].data.push({ category: time_period.slice(0, 7), cost: price });
      });
      const groupedArray = Object.values(groupedData);
      console.log(groupedArray)
      setData([...groupedArray]);
    } catch (e) {
      console.log(e);
    };
  }

  const hadleSearchChange = async (value) => {
    const res = await axios.post(`${import.meta.env.VITE_PATH}/api/predict/search`, {
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
    if(history.state.id === undefined) {
      setNoAlocID(true);
    } else {
      try {
        const respone = await axios.post(`${import.meta.env.VITE_PATH}/api/predict/check`, {
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
    };
  }

  const handleScroll = () => {
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById('headerWrapper').style.top = '-50px';
    } else {
      document.getElementById('headerWrapper').style.top = '0px';
    }
  }

  const round = (num, digit) => {
    return +(Math.round(num + "e+" + digit) + "e-" + digit);
  }

  useEffect(() => {
    hadleSearchChange('');
    window.onscroll = () => handleScroll();
    if(isLoading) checkDataState();
  }, [])

  return (
    <div className="analysisWrapper">
      <ScrollRestoration />
      <div id="headerWrapper">
        <Header/>
        <div className="boilerPlateHeader">
          <div style={{display: 'flex', flexDirection: 'row', flex: 5, justifyContent: 'flex-start', margin: 0, padding: 0}}>
            <Link style={{textDecoration: "none", border: '1px solid #eee'}} className="headerLink" to={"/service/distribution"} state={{authToken: history.state.authToken}}>Распределения</Link>
            <Link style={{textDecoration: "none", border: '1px solid #eee'}} className="headerLink selected" to={"./"}>Анализ</Link>
          </div>
          <div style={{display: 'flex', flexDirection: 'row', flex: 1, margin: 0, padding: 0}}>
            <Link style={{textDecoration: "none", border: '1px solid #eee'}} className="headerLink reg" to={"/registration"}>Сменить аккаунт</Link>
          </div>
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
                <XAxis dataKey="category" allowDuplicatedCategory={false} tickMargin={12}/>
                <YAxis dataKey="cost" tickMargin={12}/>
                <Tooltip formatter={value => `${round(value, 2)}`} labelStyle={{color: '#000'}} contentStyle={{borderRadius: 14, border: '1px solid #ddd'}}/>
                <Legend />
                {data.map((item) => (
                  <Line r={3} type="monotone" stroke="#006e47" dataKey="cost" data={item.data} name={item.building} key={item.building} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
      <Modal 
        title='Выберите распределение' 
        open={noAlocID}
        onCancel={() => setNoAlocID(false)}
      >
        <div style={{marginTop: 20, marginBottom: 20, width: 200}}>
          <Select style={{width: '100%'}}/>
        </div>
      </Modal>
    </div>
  );
};

export default Analysis;