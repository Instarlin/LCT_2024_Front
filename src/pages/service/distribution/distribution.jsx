import React, { useEffect, useState } from "react";
import { Header } from "../../../components";
import { Link, useLocation } from "react-router-dom";
import { Table, Space, Tag, Modal, Steps, Button, Upload, Select, Input, Switch, message } from 'antd';
import { InboxOutlined, PlusOutlined, FileAddOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../service.css';
import './distribution.css'
const { Dragger } = Upload;

const data = [
  {
    key: '1',
    name: 'John Brown',
    category: 'efjewfli',
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '4',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '5',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '6',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '7',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '8',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '9',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '10',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '11',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '12',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
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
  const [allocID, setAllocID] = useState('');
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
    headers: {
      "Authorization": `Bearer ${authToken.state.authToken}`,
    }});
    console.log(response);
  };

  const createAlocation = async (name) => {
    const response = await axios.post('http://192.144.13.15/api/allocation', {
      "name": name,
      "category_name": selectedAlocationCategory
    }, {
    headers: {
      "Authorization": `Bearer ${authToken.state.authToken}`,
    }});
    const getResponse = await axios.get('http://192.144.13.15/api/allocation', {}, {
    headers: {
      "Authorization": `Bearer ${authToken.state.authToken}`,
    }});
    console.log(getResponse)
  };

  const uploadBills = async ({file}) => {
    const formData = new FormData();
    formData.append('alloc_id', '');
    formData.append('bills_to_pay', file);
    const response = await fetch('http://192.144.13.15/api/bills', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${authToken.state.authToken}`,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });
    // const response = await axios({
    //   method: 'post',
    //   url: 'http://192.144.13.15/api/bills',
    //   data: formData,
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //     "Authorization": `Bearer ${authToken.state.authToken}`,
    //   },
    // });
    console.log(response)
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
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      filters: filterOptions,
      onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
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
                  <h4 
                  // onClick={e => {setTableData(
                  //   data.filter(elem => elem.category.includes(tag))
                  // ); console.log(tag)}}
                  >{tag}</h4>
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
          onCancel={() => openModal(false)}
          width={'50%'}
          footer={[
            <Button style={{display: displayPrevBtn?'':'none'}} onClick={() => {
              prev();
              if(current < 2) {setDisplayPrevBtn(false)};
              console.log(current )
            }}>
              {'Previous'}
            </Button>,
            <Button type="primary" onClick={() => {
              current === stepsTitles.length - 1?() => {
                openModal(false);
                
              }:next(); 
              if(current > -1) {
                setDisplayPrevBtn(true);
              };
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
                  onChange(info) {
                    const { status } = info.file;
                    if (status !== 'uploading') {
                      console.log(info.file, info.fileList);
                    }
                    if (status === 'done') {
                      message.success(`${info.file.name} file uploaded successfully.`);
                    } else if (status === 'error') {
                      message.error(`${info.file.name} file upload failed.`);
                    }
                  },
                  onDrop(e) {
                    console.log('Dropped files', e.dataTransfer.files);
                  },
                  customRequest: uploadBills
                  }}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </Dragger>
              </div>
            ),(
              <div className="stepWrapper">
                <Dragger {...props}>
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
                  <p>Подпись</p>
                </div>
                <div className={'element'}>
                  <Switch />
                  <p>Подпись</p>
                </div>
                <div className={'element'}>
                  <Switch />
                  <p>Подпись</p>
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

const props = {
  name: 'file',
  multiple: true,
  maxCount: 3,
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const stepsTitles = [
  {title: 'Назовите распределение'},
  {title: 'Добавьте счета'},
  {title: 'Загрузка 5'},
  {title: 'Настройки'},
];

export default Distribution;