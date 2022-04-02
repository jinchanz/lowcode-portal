import { material, project } from '@alilc/lowcode-engine';
import { Message, Dialog } from '@alifd/next';

export const preview = () => {
  saveSchema();
  setTimeout(() => {
    window.open(`./preview.html${location.search}`);
  }, 500);
};

export const saveSchema = async () => {
  const schema = project.exportSchema();
  const url = 'https://documents.ablula.tech/api/v1/schemas';
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
   mode: 'cors', // no-cors, *cors, same-origin
   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
   credentials: 'same-origin', // include, *same-origin, omit
   headers: {
     'Content-Type': 'application/json'
     // 'Content-Type': 'application/x-www-form-urlencoded',
   },
   redirect: 'follow', // manual, *follow, error
   referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
   body: JSON.stringify(schema)
  });
  console.log(response);
  Message.success('保存成功');
};

export const getPageSchema = async () => {
  const schema = await request('https://documents.ablula.tech/admin/schema.json');
  return schema.componentsTree[0];
};

export const getFullSchema = async () => {
  return await request('https://documents.ablula.tech/admin/schema.json');
};

export const getAssets = async () => {
  return await request('https://i.ablula.tech/portal/assets.json');
};

function request(
  dataAPI: string,
  method = 'GET',
  data?: object | string,
  headers?: object,
  otherProps?: any,
): Promise<any> {
  return new Promise((resolve, reject): void => {
    if (otherProps && otherProps.timeout) {
      setTimeout((): void => {
        reject(new Error('timeout'));
      }, otherProps.timeout);
    }
    fetch(dataAPI, {
      method,
      credentials: 'include',
      headers,
      body: data,
      ...otherProps,
    })
      .then((response: Response): any => {
        switch (response.status) {
          case 200:
          case 201:
          case 202:
            return response.json();
          case 204:
            if (method === 'DELETE') {
              return {
                success: true,
              };
            } else {
              return {
                __success: false,
                code: response.status,
              };
            }
          case 400:
          case 401:
          case 403:
          case 404:
          case 406:
          case 410:
          case 422:
          case 500:
            return response
              .json()
              .then((res: object): any => {
                return {
                  __success: false,
                  code: response.status,
                  data: res,
                };
              })
              .catch((): object => {
                return {
                  __success: false,
                  code: response.status,
                };
              });
          default:
            return null;
        }
      })
      .then((json: any): void => {
        if (json && json.__success !== false) {
          resolve(json);
        } else {
          delete json.__success;
          reject(json);
        }
      })
      .catch((err: Error): void => {
        reject(err);
      });
  });
}