import * as React from 'react';
import { Loading } from '@alifd/next';

const { useState, useEffect } = React;

export interface Block {

}

export interface BlockResponse {
  code: number;
  data: Block[];
}

export interface BlockPaneAPI {
  listBlocks: () => BlockResponse;
}

export interface BlockPaneProps {
  api: BlockPaneAPI
}

export const BlockPane = (props: BlockPaneProps) => {
  const { api } = props;
  const [ blocks, setBlocks ] = useState();
  const { listBlocks } = api;
  useEffect(() => {
    const fetchBlocks = async () => {
      const res = await listBlocks();
      if (res?.code) {
        console.error('list block failed: ', res);
        return;
      }
      console.log('res in plugin: ', res);
      setBlocks(res);
    };

    fetchBlocks();
  }, []);

  if (!blocks?.length) {
    return <Loading />
  }

  return <div>
    {
      blocks.map(item => item.schema)
    }
  </div>;

} 

export default BlockPane;