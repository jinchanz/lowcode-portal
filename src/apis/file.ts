import { request } from "src/utils";

const BASE_URL = '/api/v1';

export const listFiles = async () => {
  const url = `${BASE_URL}/files`;
  const res = await request(url);
  console.log('res: ', res);
  if (res.code) {
    console.error('list file failed: ', res);
    return;
  }
  return res.data;
}


export const createFile = async (file) => {
  const url = `${BASE_URL}/files`;
  const res = await (await fetch(url, {
    method: 'post',
    headers: {
     'Content-Type': 'application/json'
     // 'Content-Type': 'application/x-www-form-urlencoded',
   },
    body: JSON.stringify({file})
})).json()
  console.log('res: ', res);
  if (res.code) {
    console.error('create file failed: ', res);
    return;
  }
  return res.data;
}