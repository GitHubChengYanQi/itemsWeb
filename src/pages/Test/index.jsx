import React, {useState} from 'react';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import styles from './index.module.less';

import QueueAnim from 'rc-queue-anim';
import TweenOne, {TweenOneGroup} from 'rc-tween-one';

const TableContext = React.createContext(false);

const Test = () => {

  const data = [
    {
      key: 1,
      name: 'John Brown',
      age: 32,
      address: 'New York No.1 Lake Park',
    },
    {
      key: 2,
      name: 'Jim Green',
      age: 42,
      address: 'London No.1 Lake Park',
    },
    {
      key: 3,
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No.1 Lake Park',
    },
    {
      key: 4,
      name: 'Jim Red',
      age: 18,
      address: 'London No.1 Lake Park',
    },
  ];

  const [state, setState] = useState(data);
  console.log(state);
  const onEnd = (e) => {
    const dom = e.target;
    dom.style.height = 'auto';
  };

  const onAdd = () => {
    const data = state;
    const i = Math.round(Math.random() * (data.length - 1));
    setState([{
      key: Date.now(),
      name: data[i].name,
      age: data.length,
      address: data[i].address,
    }, ...data]);
  };

  const onDelete = (key, e) => {
    e.preventDefault();
    const data = state.filter(item => item.key !== key);
    setState(data);
  };

  const className = 'table-enter-leave-demo';
  const columns = [
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {title: 'Age', dataIndex: 'age', key: 'age'},
    {title: 'Address', dataIndex: 'address', key: 'address'},
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => (
        <span
          className={styles[`${className}-delete`]}
          onClick={(e) => {
            onDelete(record.key, e);
          }}
        >
            Delete
        </span>
      ),
    },
  ];
  const enterAnim = [
    {
      opacity: 1, x: 0, backgroundColor: '#fffeee', duration: 1, moment: 0
    },
    {
      duration: 200,
      type: 'from',
      delay: 250,
      ease: 'easeOutQuad',
      onComplete: () => {
        setState(state.map((item, index) => ({...item, start: index === 1 && false})));
      },
    },
    {
      opacity: 1, x: 0, duration: 250, ease: 'easeOutQuad',
    },
    {delay: 1000, backgroundColor: '#fff'},
  ];
  const pageEnterAnim = [
    {
      opacity: 0, duration: 0,
    },
    {
      height: 0,
      duration: 150,
      type: 'from',
      delay: 150,
      ease: 'easeOutQuad',
      onComplete: onEnd,
    },
    {
      opacity: 1, duration: 150, ease: 'easeOutQuad',
    },
  ];
  const leaveAnim = [
    {duration: 250, opacity: 0},
    {height: 0, duration: 200, ease: 'easeOutQuad'},
  ];
  const pageLeaveAnim = [
    {duration: 150, opacity: 0},
    {height: 0, duration: 150, ease: 'easeOutQuad'},
  ];
  // 动画标签，页面切换时改用 context 传递参数；

  return <>
    <Button onClick={() => setState(state.map((item, index) => ({...item, start: index === 1})))}>add</Button>
    <div>
      {state.map((item, index) => {
        return <TweenOne
          moment={item.start ? 0 : null}
          animation={enterAnim}
          style={{height: 30}}
          key={index}>123</TweenOne>;
      })}
    </div>
  </>;


  return (
    <div className={styles[`${className}-wrapper`]}>
      <div className={styles[className]}>
        <div className={styles[`${className}-table-wrapper`]}>
          <div className={styles[`${className}-action-bar`]}>
            <Button type="primary" onClick={onAdd}>Add</Button>
          </div>
          <Table
            columns={columns}
            pagination={{pageSize: 4}}
            dataSource={state}
            className={styles[`${className}-table`]}
            components={{
              body: {
                wrapper: (props) => {
                  console.log(props);
                  return <TweenOneGroup
                    component="tbody"
                    enter={enterAnim}
                    leave={leaveAnim}
                    appear={false}
                    exclusive
                    className={props.className}
                  >
                    {props.children}
                  </TweenOneGroup>;
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
;


export default Test;
