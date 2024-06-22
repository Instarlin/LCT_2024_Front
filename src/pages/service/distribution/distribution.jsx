import React, { useEffect, useState } from "react";
import { Header } from "../../../components";
import { Link, useLocation } from "react-router-dom";
import { Table, Space, Modal, Steps, Button, Upload, Select, Input, Switch, message } from 'antd';
import { InboxOutlined, PlusOutlined, FileAddOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../service.css';
import './distribution.css'
const { Dragger } = Upload;

const data = [
  {
    key: '1',
    name: 'Распределение 1',
    category: 'Новая категория 2',
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Распределение 12',
    category: 'Новая категория 2',
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Распределение 3',
    category: 'Новая категория 2',
    address: 'Sydney No. 1 Lake Park',
  },
];

const Distribution = () => {
  const [modal, openModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [current, setCurrent] = useState(0);
  const [displayPrevBtn, setDisplayPrevBtn] = useState(false);
  const [distrName, setDistrName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [selectedAlocationCategory, setSelectedAlocationCategory] = useState('');
  const [allocID, setAllocID] = useState('No data');
  const [tags, setTags] = useState([]);
  const [tableData, setTableData] = useState(data);
  const authToken = useLocation();

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);
  
  const items = stepsTitles.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const handleValueSelection = (value) => setSelectedAlocationCategory(value);

  const getAlocations = async () => {
    const response = await axios.get('http://192.144.13.15/api/allocation', {
      "name": null,
      headers: {
        "Authorization": `Bearer ${authToken.state.authToken}`,
      }
    });
  };

  const createAlocation = async (name) => {
    await axios.post('http://192.144.13.15/api/allocation', {
      "name": name,
      "category_name": selectedAlocationCategory
    }, {
      headers: {
        "Authorization": `Bearer ${authToken.state.authToken}`,
    }});
    const getResponse = await axios.get('http://192.144.13.15/api/allocation', {
      "name": null,
      headers: {
        "Authorization": `Bearer ${authToken.state.authToken}`,
    }});
    getResponse.data.map(item => {if(item.name == name) setAllocID(item.alloc_id)});
  };

  const deleteAllocation = async (name) => {
    await axios.delete('http://192.144.13.15/api/allocation')
  };

  const uploadBills = async ({file}) => {
    try {
      const formData = new FormData();
      formData.append('alloc_id', allocID);
      formData.append('bills_to_pay', file);
      const response = await axios.post('http://192.144.13.15/api/bills', formData, {
        headers: {
          "Authorization": `Bearer ${authToken.state.authToken}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
        },
      });
      message.success(`${file.name} был успешно загружен.`)
    } catch (e) {
      console.log(e);
      message.error(`Файл не был загружен.`);
    }
  };

  const uploadRefs = async ({file}) => {
    try {
      const formData = new FormData();
      formData.append('alloc_id', allocID);
      formData.append('bills_to_pay', file);
      const response = await axios.post('http://192.144.13.15/api/bills/refs', formData, {
        headers: {
          "Authorization": `Bearer ${authToken.state.authToken}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
        },
      });
      message.success(`${file.name} был успешно загружен.`)
    } catch (e) {
      console.log(e);
      message.error(`Файл не был загружен.`);
    }
  };

  const getCategories = async () => {
    const response = await axios.get('http://192.144.13.15/api/category', {
    headers: {
      "Authorization": `Bearer ${authToken.state.authToken}`,
    }});
    let list = [];
    response.data.map(item => {
      list.push(item.name)
    })
    setTags([...list]);
  };

  const createCategory = async (name) => {
    await axios.post('http://192.144.13.15/api/category', {
      "name": name,
    }, {
      headers: {
        "Authorization": `Bearer ${authToken.state.authToken}`,
      }
    })
  };

  const options = tags.map((item) => {
    return {
      value: item,
      title: item,
    }
  });

  const filterOptions = tags.map((item) => {
    return {
      text: item,
      value: item,
    }
  });

  const columns = [
    {
      title: 'Распределение',
      dataIndex: 'distribution',
      key: 'distribution',
      with: '20%',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      filters: filterOptions,
      onFilter: (value, record) => record.category.indexOf(value) === 0,
    },
    {
      title: 'Счета на полату',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Справочники',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getAlocations();
    getCategories();
  }, [])

  return (
    <div className="distrWrapper">
      <Header/>
      <div className="boilerPlateHeader">
          <Link style={{textDecoration: "none"}} className="headerLink selected" to={"./"}>Распределения</Link>
          <Link style={{textDecoration: "none"}} className="headerLink" to={"/service/analysis"} state={{authToken: authToken.state.authToken}}>Анализ</Link>
      </div>
      <div className="boilerPlateWrapper boilerPlateWrapperDistribution">
        <div className="distributionWrapper">
          <div className="mainContent">
            <div className="sidebar">
              <div className="topBarInfo">
                <div className="topBarBtn" onClick={() => openModal(true)}>
                  <FileAddOutlined />
                  <h3>Добавить распределение</h3>
                </div>
                <h4 onClick={getAlocations}>Все распределения</h4>
                {tags.map((tag, index) => (
                  <h4 key={index}>{tag}</h4>
                ))}
                <div className="bottomBtn" onClick={() => setCategoryModal(true)}>
                  <PlusOutlined style={{fontSize: 'large'}}/>
                  <h4>Создать категорию</h4>
                </div>
              </div>
            </div>
            <div className="tableWrapper">
              <Table rowSelection={{}} pagination={{position: ['bottomCenter'], hideOnSinglePage: true}} columns={columns} dataSource={tableData} className="table"/>
            </div>
          </div>
        </div>
        <Modal
          title="Создать новое распределение"
          centered
          open={modal}
          onCancel={() => {
            openModal(false);

          }}
          width={'50%'}
          footer={[
            <Button style={{display: displayPrevBtn?'':'none'}} onClick={() => {
              prev();
              if(current < 2) {setDisplayPrevBtn(false)};
            }}>
              {'Previous'}
            </Button>,
            <Button type="primary" onClick={() => {
              current === stepsTitles.length - 1?openModal(false):next();
              if(current > -1) setDisplayPrevBtn(true);
              if(current === 0) createAlocation(distrName);
            }}>
              {current === stepsTitles.length - 1?'Done':'Next'}
            </Button>,
          ]}
        >
          <Steps current={current} items={items} />
          <div className="modalContent">
            {[( 
              <div className="stepWrapper firstStep">
                <div className="firstStepWrapper">
                  <Input size='large' placeholder="Название..." variant="filled" value={distrName} onChange={e => setDistrName(e.target.value)}/>
                  <Select options={options} size='large' variant="filled" value={selectedAlocationCategory} onChange={handleValueSelection} className='selector' placeholder='Категория...'/>
                </div>
              </div>
            ),(
              <div className="stepWrapper">
                <Dragger {...{
                  name: 'file',
                  multiple: true,
                  maxCount: 3,
                  accept: '.xlsx',
                  customRequest: uploadBills,
                  onDrop(e) {
                    console.log('Dropped files', e.dataTransfer.files);
                  },
                  format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
                }}> 
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </Dragger>
              </div>
            ),(
              <div className="stepWrapper">
                <Dragger {...{
                  name: 'file',
                  multiple: true,
                  maxCount: 3,
                  accept: '.xlsx',
                  //* ---------------------------------------------------- here -----------------------------------------
                  // customRequest: uploadRefs,
                  onDrop(e) {
                    console.log('Dropped files', e.dataTransfer.files);
                  },
                  format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
                }}> 
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </Dragger>
              </div>
            ),(
              <div className="fourthStep">
                <div className={'element'}>
                  <Switch />
                  <p>Настройка 1</p>
                </div>
                <div className={'element'}>
                  <Switch />
                  <p>Настройка 2</p>
                </div>
                <div className={'element'}>
                  <Switch />
                  <p>Настройка 3</p>
                </div>
              </div>
            )][current]}
          </div>
        </Modal>
        <Modal 
          title="Создать новую категорию"
          centered
          open={categoryModal}
          onCancel={() => {setCategoryModal(false); setCategoryName('')}}
          onOk={() => {
            setCategoryModal(false);
            setTags([...tags, categoryName]);
            createCategory(categoryName);
            setCategoryName('');
          }}
        >
          <Input value={categoryName} onChange={e => setCategoryName(e.target.value)}/>
        </Modal>
      </div>
    </div>
  );
};

const stepsTitles = [
  {title: 'Название'},
  {title: 'Добавьте счета'},
  {title: 'Добавьте справочники'},
  {title: 'Настройки'},
];

export default Distribution;