import { useRef, useState } from 'react';
import { useDraggable } from '@neodrag/react';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import useRightClick from './hooks/useRightClick';
import useClickOutside from './hooks/useClickOutside';
import { Menu } from "antd";
import './App.css';

function App() {
  const [menuState, setMenuState] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const CLICK_THRESHOLD = 200;
  const { x, y, showMenu } = useRightClick();
  const menuRef = useRef(null);

  const handleClick = event => {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime < CLICK_THRESHOLD && event.detail === 2) {
      setMenuState(!menuState);
    }
    setLastClickTime(currentTime);
  };

  const handleAddElement = () => {
  };

  const items = [
    {
      key: 'sub1',
      label: 'Navigation One',
      icon: <MailOutlined />,
      children: [
        {
          key: 'g1',
          label: 'Item 1',
          type: 'group',
          children: [
            {
              key: '1',
              label: 'Option 1',
            },
            {
              key: '2',
              label: 'Option 2',
            },
          ],
        },
        {
          key: 'g2',
          label: 'Item 2',
          type: 'group',
          children: [
            {
              key: '3',
              label: 'Option 3',
            },
            {
              key: '4',
              label: 'Option 4',
            },
          ],
        },
      ],
    },
    {
      key: 'sub2',
      label: 'Navigation Two',
      icon: <AppstoreOutlined />,
      children: [
        {
          key: '5',
          label: 'Option 5',
        },
        {
          key: '6',
          label: 'Option 6',
        },
        {
          key: 'sub3',
          label: 'Submenu',
          children: [
            {
              key: '7',
              label: 'Option 7',
            },
            {
              key: '8',
              label: 'Option 8',
            },
          ],
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: 'sub4',
      label: 'Navigation Three',
      icon: <SettingOutlined />,
      children: [
        {
          key: '9',
          label: 'Option 9',
        },
        {
          key: '10',
          label: 'Option 10',
        },
        {
          key: '11',
          label: 'Option 11',
        },
        {
          key: '12',
          label: 'Option 12',
        },
      ],
    },
  ];

  useClickOutside(menuRef, () => setMenuState(false));

  return (
    <>
      <div
        ref={menuRef}
        style={{
          position: 'absolute',
          top: `${y}px`,
          left: `${x}px`,
          display: showMenu ? 'block' : 'none',
          zIndex: 1000,
        }}
      >
        <Menu
          items={items}
        />
      </div>
      <DraggableElement 
        menuState={menuState}
        handleClick={handleClick}
        items={items}
      />
    </>
  );
}

function DraggableElement({ menuState, handleClick, items }) {
  const draggableRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useDraggable(draggableRef, {
    onDrag: ({ offsetX, offsetY }) => setPosition({ x: offsetX, y: offsetY })
  });

  const handleMenuSelect = (item) => {
  };

  return (
    <>
      <div ref={draggableRef} className='drag' onClick={handleClick}>
        <Menu 
          className={menuState ? 'menu shown' : 'menu hidden'} 
          items={items}
          onClick={item => handleMenuSelect(item)}
        />
      </div>
      <p>Position: x = {position.x}, y = {position.y}</p>
    </>
  );
}