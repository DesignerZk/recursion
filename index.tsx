import React, { useState, Children } from 'react';
import styles from './index.css';
import { Tree, Modal, Button, Input } from 'antd';
import { getFileItem } from 'antd/lib/upload/utils';

const { TreeNode } = Tree;
export default function() {
  const [treeData, setTreeData] = useState({
    list: [
      {
        title: '0-0',
        key: '0-0',
        children: [
          {
            title: '0-0-0',
            key: '0-0-0',
            children: [
              { title: '0-0-0-0', key: '0-0-0-0' },
              { title: '0-0-0-1', key: '0-0-0-1' },
              { title: '0-0-0-2', key: '0-0-0-2' },
            ],
          },
          {
            title: '0-0-1',
            key: '0-0-1',
            children: [
              { title: '0-0-1-0', key: '0-0-1-0' },
              { title: '0-0-1-1', key: '0-0-1-1' },
              { title: '0-0-1-2', key: '0-0-1-2' },
            ],
          },
          {
            title: '0-0-2',
            key: '0-0-2',
          },
        ],
      },
      {
        title: '0-1',
        key: '0-1',
        children: [
          { title: '0-1-0-0', key: '0-1-0-0' },
          { title: '0-1-0-1', key: '0-1-0-1' },
          { title: '0-1-0-2', key: '0-1-0-2' },
        ],
      },
      {
        title: '0-2',
        key: '0-2',
      },
    ],
  });
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('');
  const [inputValue, setInputValue] = useState('');
  const onSelect = (selectedKeys: any, info: any) => {
    showModal(selectedKeys.join(''));
  };
  const showModal = (keys: any) => {
    console.log(keys, 'keys');
    setSelected(keys);
    setVisible(true);
  };
  const changeInput = (e: any) => {
    setInputValue(e.target.value);
  };
  // 处理单个节点
  const changeTitle = (obj: any, targetNodeKey: any, title: any) => {
    // 如果这个节点的key与要修改的节点的key相同，那就直接修改，然后返回true表示修改已经完成
    if (obj.key === targetNodeKey) {
      obj.title = title;
      return true;
    }
    // 否则。继续找这个节点下面的子节点，直到找到了与目标节点key相同的节点并，修改完成返回true
    if (obj.children && obj.children.length > 0) {
      for (let child of obj.children) {
        const hasChanged = changeTitle(child, targetNodeKey, title);
        if (hasChanged) return true;
      }
    }
    // 所有子节点都找完了，没有找到目标节点，返回false
    return false;
  };

  const handleOk = () => {
    setVisible(false);
    const returnList = JSON.parse(JSON.stringify(treeData.list)); // 深拷贝一份
    for (let item of returnList) {
      // 根据是否返回了true（是否已经修改了目标节点），确定是否还要继续查找
      const hasChanged = changeTitle(item, selected, inputValue);
      if (hasChanged) {
        setTreeData({
          list: returnList,
        });
        break;
      }
    }
  };

  const setTreeDataList = (newTreeData: any) => {
    setTreeData({
      list: newTreeData,
    });
    console.log(treeData.list, 'treeData.list');
  };

  const handleCancel = () => {
    setVisible(false);
  };
  console.log(treeData);
  return (
    <>
      <Tree
        defaultExpandedKeys={['0-0-0', '0-0-1']}
        defaultSelectedKeys={['0-0-0', '0-0-1']}
        defaultCheckedKeys={['0-0-0', '0-0-1']}
        onSelect={onSelect}
        treeData={treeData.list}
      />
      <Modal title="修改" visible={visible} onOk={handleOk} onCancel={handleCancel} width={200}>
        <Input refs="title" onChange={changeInput} />
      </Modal>
    </>
  );
}
