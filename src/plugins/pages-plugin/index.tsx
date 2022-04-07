import * as React from 'react';
import { Nav, Button, Dialog, Form, Radio, Input } from '@alifd/next';
import {
  project,
  config,
} from '@alilc/lowcode-engine';

import {
  getPageSchema,
} from '../../universal/utils';

import { listFiles, createFile as createFileAPI } from '../../apis/file';

const { useEffect, useState } = React;
const { Item } = Nav;
const formItemLayout = {
  labelCol: {
    fixedSpan: 8
  },
  wrapperCol: {
    span: 14
  }
};


export default () => {

  const [ files, setFiles ] = useState([]);

  useEffect(() => {
    async function getFiles() {
      const files = await listFiles();
      setFiles(files);
    }
    getFiles();
  }, []);

  const defaultCurrentPage = config.get('currentPage') || 'home';

  const onSelect = async (keys : string[]) => {
    const key: string = keys[0];
    
    const schema = await getPageSchema(key);
    console.log('schema: ', schema);
    // 加载 schema
    project.removeDocument(project.currentDocument as any);
    project.openDocument(schema);
    config.set('currentPage', key);
  };

  const createFile = async (values) => {
    console.log('values: ', values);
    const result = await createFileAPI(values);
    console.log('result: ', result);
  }

  const openFileCreator = async () => {
    Dialog.show({
      v2: true,
      title: "Quick",
      footer: ' ',
      content: <Form {...formItemLayout} colon>
      <Form.Item
        name="name"
        label="文件名"
        required
        requiredMessage="Please input your username!"
      >
        <Input name="name" />
      </Form.Item>
      <Form.Item
        name="locator"
        label="路由"
        required
        requiredMessage="Please input your username!"
      >
        <Input name="locator" />
      </Form.Item>
      <Form.Item
        name="type"
        label="类型"
        required
        requiredMessage="Please input your password!"
      >
        <Radio.Group name="type" shape="button" dataSource={[
          {
            label: '文件夹',
            value: 1
          },
          {
            label: '文件',
            value: 2
          }
        ]} />

      </Form.Item>
      <Form.Item label=" " colon={false}>
        <Form.Submit
          type="primary"
          validate
          onClick={createFile}
          style={{ marginRight: 8 }}
        >
          创建
        </Form.Submit>
        <Form.Reset>重置</Form.Reset>
      </Form.Item>
    </Form>
    });
  }

  console.log('files: ', files);

  return <>
    <Nav type='line' defaultSelectedKeys={[defaultCurrentPage]} onSelect={onSelect}>
      {
        files.length ? files.map(file => <Item key={file.locator} >{file.name}</Item>)
        : null
      }
    </Nav>
    <Button onClick={openFileCreator}> 新建文件 </Button>
  </>
}