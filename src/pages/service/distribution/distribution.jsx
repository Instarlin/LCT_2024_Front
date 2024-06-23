import React, { useEffect, useState, useRef } from "react";
import { Header } from "../../../components";
import { Link, useLocation, redirect } from "react-router-dom";
import { Table, Space, Modal, Steps, Button, Upload, Select, Input, Switch, message } from 'antd';
import { InboxOutlined, PlusOutlined, FileAddOutlined, CloudUploadOutlined, SearchOutlined, ForkOutlined, FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../service.css';
import './distribution.css'
const { Dragger } = Upload;

const Distribution = () => {
  const [modal, openModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [current, setCurrent] = useState(0);
  const [displayPrevBtn, setDisplayPrevBtn] = useState(false);
  const [distrName, setDistrName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [selectedAlocationCategory, setSelectedAlocationCategory] = useState(null);
  const [allocID, setAllocID] = useState('');
  const [tags, setTags] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [fileType, setFileType] = useState('');
  const authToken = useLocation();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);
  
  const handleValueSelection = (value) => setSelectedAlocationCategory(value);

  const getAlocations = async () => {
    try {
      const response = await axios.get('http://192.144.13.15/api/allocation', {
        "name": null,
        headers: {
          "Authorization": `Bearer ${authToken.state.authToken}`,
        }
      });
      const tableList = response.data.map((value) => ({
        key: value.alloc_id,
        distribution: value.name,
        category: value.category_name,
        analys: value.user_id
      }));
      setTableData(tableList);
    } catch (e) {
      message.error(`${e.response?.data?.detail || "Error occurred"}`);
      if(e.response?.status == 401) redirect("/registration");
      console.log(e);
    };
  };

  const createAlocation = async (name) => {
    await axios.post('http://192.144.13.15/api/allocation', {
      "name": name,
      "category_name": selectedAlocationCategory
    }, {
      headers: {
        "Authorization": `Bearer ${authToken.state.authToken}`,
    }});
    const response = await axios.get('http://192.144.13.15/api/allocation', {
      "name": null,
      headers: {
        "Authorization": `Bearer ${authToken.state.authToken}`,
    }});
    response.data.map(item => {if(item.name == name) setAllocID(item.alloc_id)});
    console.log(response)
  };

  const processAllocation = async (alloc_id) => {
    console.log(alloc_id)
    const res = axios.post('http://192.144.13.15/api/allocation/process', {
      "allocation_id": alloc_id,
      "rules": {},
      headers: {
        "Authorization": `Bearer ${authToken.state.authToken}`,
      }
    })
    console.log(res);
  }

  const downloadAllocation = async (alloc_id) => {
    console.log(alloc_id, authToken.state.authToken)
    const res = await axios.post('http://192.144.13.15/api/allocation/download', {
      "allocation_id": alloc_id,
      "xlsx_or_csv": false,
      }, {
      headers: {
        "Authorization": `Bearer ${authToken.state.authToken}`,
      }
    })
    console.log(res);
  }

  const deleteAllocation = async () => {
    await axios.delete('http://192.144.13.15/api/allocation/delete_by_id', {
      data: {
        "allocation_id": allocID,
      },
      headers: {
        "Authorization": `Bearer ${authToken.state.authToken}`,
      }
    });
  };

  const uploadBills = async ({file}) => {
    try {
      const formData = new FormData();
      formData.append('alloc_id', allocID);
      formData.append('bills_to_pay', file);
      await axios.post('http://192.144.13.15/api/bills', formData, {
        headers: {
          "Authorization": `Bearer ${authToken.state.authToken}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          console.log(event)
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
      formData.append(fileType, file);
      const res = await axios.post('http://192.144.13.15/api/bills/refs', formData, {
        headers: {
          "Authorization": `Bearer ${authToken.state.authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(file, fileType)
      console.log(res)
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

  const items = stepsTitles.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              setSearchText('');
              handleSearch(selectedKeys, confirm, dataIndex);
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#027540' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: 'Распределение',
      dataIndex: 'distribution',
      key: 'distribution',
      ...getColumnSearchProps('distribution'),
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      filters: filterOptions,
      onFilter: (value, record) => record.category.indexOf(value) === 0,
    },
    {
      title: 'Анализ',
      dataIndex: 'analys',
      key: 'analys',
      render: (_, record) => (
        <Button onClick={() => downloadAllocation(record.key)}>Анализ распределения</Button>
      )
    },
    {
      title: 'Предсказание',
      key: 'prediction',
      render: (_, record) => (
        <Space size="middle">
          <Link to={'/service/analysis'} state={{authToken: authToken.state.authToken, id: record.key}}>Предсказание {record.distribution}</Link>
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
                {/* <h4 onClick={getAlocations}>Все распределения</h4>
                {tags.map((tag, index) => (
                  <h4 key={index}>{tag}</h4>
                ))} */}
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
            deleteAllocation();
            handleValueSelection('');
            setDistrName('');
            setCurrent(0);
          }}
          width={'50%'}
          footer={[
            <Button 
              style={{display: displayPrevBtn?'':'none'}}
              onClick={() => {
                prev();
                if(current < 2) {setDisplayPrevBtn(false)};
              }}
            >
              {'Previous'}
            </Button>,
            <Button 
              type="primary"
              disabled={(distrName !== '' && selectedAlocationCategory !== '')?false:true}
              onClick={() => {
                current === stepsTitles.length - 1?openModal(false):next();
                if(current > -1) setDisplayPrevBtn(true);
                if(current === 0) createAlocation(distrName);
              }}
            >
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
              <div className="thirdStep">
                <div>
                  <Dragger {...{
                    name: 'fixedassets',
                    maxCount: 1,
                    accept: '.xlsx',
                    customRequest: uploadRefs,
                    onDrop() {
                      setFileType('fixedassets')
                    },
                    format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
                  }}>
                    <p className="ant-upload-drag-icon">
                    <CloudUploadOutlined />
                    </p>
                    <p className="ant-upload-text">Основные средства</p>
                  </Dragger>
                </div>
                <div>
                  <Dragger {...{
                    name: 'building_squares',
                    maxCount: 1,
                    accept: '.xlsx',
                    customRequest: uploadRefs,
                    onDrop() {
                      setFileType('building_squares')
                    },
                    format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
                  }}>
                    <p className="ant-upload-drag-icon">
                    <FileTextOutlined />
                    </p>
                    <p className="ant-upload-text">Площади зданий</p>
                  </Dragger>
                </div>
                <div style={{flex: 1}}>
                  <Dragger {...{
                    name: 'codes',
                    maxCount: 1,
                    accept: '.xlsx',
                    customRequest: uploadRefs,
                    onDrop() {
                      setFileType('codes')
                    },
                    format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
                  }}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Коды услуг</p>
                  </Dragger>
                </div>
                <div>
                  <Dragger {...{
                    name: 'contracts_to_building',
                    maxCount: 1,
                    accept: '.xlsx',
                    customRequest: uploadRefs,
                    onDrop() {
                      setFileType('contracts_to_building')
                    },
                    format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
                  }}>
                    <p className="ant-upload-drag-icon">
                    <ForkOutlined />
                    </p>
                    <p className="ant-upload-text">Связь договор - здания</p>
                  </Dragger>
                </div>
                <div>
                  <Dragger {...{
                    name: 'contacts',
                    maxCount: 1,
                    accept: '.xlsx',
                    customRequest: uploadRefs,
                    onDrop() {
                      setFileType('contacts')
                    },
                    format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
                  }}>
                    <p className="ant-upload-drag-icon">
                    <FileAddOutlined />
                    </p>
                    <p className="ant-upload-text">Документы</p>
                  </Dragger>
                </div>
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