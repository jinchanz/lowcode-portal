import * as React from 'react';
import { Nav } from '@alifd/next';
import {
  project,
  config,
} from '@alilc/lowcode-engine';

import {
  getPageSchema,
} from '../../universal/utils';

const { Item } = Nav;

export default () => {

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

  return <Nav type='line' defaultSelectedKeys={[defaultCurrentPage]} onSelect={onSelect}>
    <Item key='home' >首页</Item>
    <Item key='login' >登录页</Item>
</Nav>
}