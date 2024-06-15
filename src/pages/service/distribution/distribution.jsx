import React, { useState } from "react";
import { Header } from "../../../components";
import { Link } from "react-router-dom";
import { Table, Space, Tag, Modal, Steps, Button } from 'antd';
import axios from 'axios';
import '../service.css';
import './distribution.css'

const Distribution = () => {
  const [modal, openModal] = useState(false);
  const [current, setCurrent] = useState(0);
  const [displayPrevBtn, setDisplayPrevBtn] = useState(false);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  
  const getDistributions = async () => {
    try {
      const response = await axios.get('../../dragEl/data.json');
      console.log(response);
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="distrWrapper">
      <Header/>
      <div className="boilerPlateHeader">
          <Link style={{textDecoration: "none"}} className="headerLink selected" to={"./"}>Распределения</Link>
          <Link style={{textDecoration: "none"}} className="headerLink" to={"/service/analysis"}>Анализ</Link>
      </div>
      <div className="boilerPlateWrapper boilerPlateWrapperDistribution">
        <div className="distributionWrapper">
          <div className="topBar">
            <div onClick={() => openModal(true)} className="topBarBtn">
              <h3>Новое распределение</h3>
            </div>
          </div>
          <div className="mainContent">
            <div className="sidebar">
              <div className="topBarInfo">
                <h2>Распределения</h2>
                <h4 onClick={getDistributions}>Все распределения</h4>
              </div>
            </div>
            <div className="tableWrapper">
              <Table pagination={{position: ['bottomCenter'], hideOnSinglePage: true}} columns={columns} dataSource={data} className="table"/>
            </div>
          </div>
        </div>
        <Modal
          title="Создать новое распределение"
          centered
          open={modal}
          onCancel={() => openModal(false)}
          width={'50%'}
          height={500}
          footer={[
            <Button style={{display: displayPrevBtn?'':'none'}} type="primary" onClick={() => prev()}>
              {'Previos'}
            </Button>,
            <Button type="primary" onClick={() => {
              current === steps.length - 1?openModal(false):next(); 
              if(current > -1) {setDisplayPrevBtn(true)} else setDisplayPrevBtn(false)
            }}>
              {current === steps.length - 1?'Done':'Next'}
            </Button>,
          ]}
        >
          <Steps current={current} items={items} />
          <div className="modalContent">{steps[current].content}</div>
          <div
            style={{
              marginTop: 24,
            }}
          >
            {/* {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={() => message.success('Processing complete!')}>
                Done
              </Button>
            )}
            {current > 0 && (
              <Button
                style={{
                  margin: '0 8px',
                }}
                onClick={() => prev()}
              >
                Previous
              </Button>
            )} */}
          </div>
        </Modal>
      </div>

    </div>
  );
};

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
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

let data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
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

const steps = [
  {
    title: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
  {
    title: 'Last',
    content: 'Last-content',
  },
];

export default Distribution;