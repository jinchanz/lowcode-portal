import * as React from 'react';
import { Node } from '@alilc/lowcode-engine';
import { Dialog, Form, Input } from '@alifd/next';

import { createBlock } from '../apis/block';

const FormItem = Form.Item;

interface SaveAsBlockProps {
  node: Node;
}

const SaveAsBlock = (props: SaveAsBlockProps) => {
  const { node } = props;

  const save = async (values) => {
    const { name, title } = values;
    const { schema } = node;
    console.log('values: ', values);
    console.log('schema: ', node.schema);

    const res = await createBlock({
      name,
      title,
      schema: JSON.stringify(schema),
    });
    console.log('res: ', res);
  }

  return <div>
    <Form style={{ width: "60%" }} colon>
      <FormItem
        name="name"
        label="英文名"
        required
        requiredMessage="Please input name!"
      >
        <Input />
      </FormItem>
      <FormItem
        name="title"
        label="中文名"
        required
        requiredMessage="Please input title!"
      >
        <Input />
      </FormItem>
      <FormItem label=" " colon={false}>
        <Form.Submit
          type="primary"
          validate
          onClick={save}
          style={{ marginRight: 8 }}
        >
          保存
        </Form.Submit>
        <Form.Reset>重置</Form.Reset>
      </FormItem>
    </Form>
  </div>
}



export default {
  name: 'add',
  content: {
    icon: 'add',
    title: '新增',
    action(node: Node) {
      console.log('node: ', node);
      Dialog.show({
        v2: true,
        title: "保存为区块",
        content: <SaveAsBlock node={node} />,
        footer: false,
      });
    },
  },
  important: true,
};