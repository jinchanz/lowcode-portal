import * as React from 'react';
import { Nav } from '@alifd/next';

const { Item } = Nav;

export default () => {

  const queryString = location.search || '';
  const defaultCurrentPage = queryString.includes('home') ? 'home' : 'login';

  const onSelect = (keys : string[]) => {
    const key: string = keys[0];
    location.href = `${location.pathname}?page=${key}`;
  };

  return <Nav type='line' selectedKeys={[defaultCurrentPage]} onSelect={onSelect}>
    <Item key='home' >首页</Item>
    <Item key='login' >登录页</Item>
</Nav>
}