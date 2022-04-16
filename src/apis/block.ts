import { request } from "src/utils";

const BASE_URL = '/api/v1';

export const listBlocks = async () => {
  const url = `${BASE_URL}/blocks`;
  const res = await request(url);
  console.log('res: ', res);
  if (res.code) {
    console.error('list block failed: ', res);
    return;
  }
  return res.data;
}

export const getBlockById = async (id) => {
  const url = `${BASE_URL}/blocks/${id}`;
  const res = await request(url);
  console.log('res: ', res);
  if (res.code) {
    console.error('list block failed: ', res);
    return;
  }
  return res.data;
}

export const createBlock = async (block) => {
  const url = `${BASE_URL}/blocks`;
  const res = await (await fetch(url, {
    method: 'post',
    headers: {
     'Content-Type': 'application/json'
     // 'Content-Type': 'application/x-www-form-urlencoded',
   },
    body: JSON.stringify({block})
})).json()
  console.log('res: ', res);
  if (res.code) {
    console.error('create block failed: ', res);
    return;
  }
  return res.data;
}