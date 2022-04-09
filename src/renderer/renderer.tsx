import React, { useEffect, useState } from 'react';
import { Loading } from '@alifd/next';
import ReactRenderer from '@alilc/lowcode-react-renderer';
import { ProjectSchema } from '@alilc/lowcode-types';
import { buildComponents, AssetLoader } from '@alilc/lowcode-utils';
import { getAssets, getFullSchemaByUrl } from '../universal/utils';

interface PortalRendererProps {
  schemaUrl?: string;
  schema?: ProjectSchema;
};

const PortalRenderer = (props: PortalRendererProps) => {
  const { schemaUrl, schema: propSchema } = props;
  const [previousSchemaUrl, setPreviousSchemaUrl] = useState(schemaUrl);
  const [assets, setAssets] = useState();
  const [schema, setSchema] = useState(propSchema);
  const [components, setComponents] = useState();
  useEffect(() => {
    const fetchAssets = async () => {
      const assets = await getAssets();
      setAssets(assets);
    };
    fetchAssets();
  }, []);
  useEffect(() => {
    const fetchSchema = async () => {
      const schema = propSchema ? propSchema : await getFullSchemaByUrl(schemaUrl);
      setSchema(schema);
    };
    fetchSchema();
  }, [schemaUrl]);

  useEffect(() => {
    if (assets && schema) {
      setComponents(undefined);
      getComponents();
    }
  }, [propSchema, schema, assets]);

  async function getComponents() {
    const { packages } = assets;
    const componentsMap: any = {};
    const { componentsMap: componentsMapArray } = schema;
    componentsMapArray.forEach((component: any) => {
      componentsMap[component.componentName] = component;
    });

    const libraryMap = {};
    const libraryAsset = [];
    packages.forEach(({ package: _package, library, urls, renderUrls }) => {
      libraryMap[_package] = library;
      if (renderUrls) {
        libraryAsset.push(renderUrls);
      } else if (urls) {
        libraryAsset.push(urls);
      }
    });

    // TODO asset may cause pollution
    const assetLoader = new AssetLoader();
    await assetLoader.load(libraryAsset);
    const components = await buildComponents(libraryMap, componentsMap);
    setPreviousSchemaUrl(schemaUrl);
    setComponents(components);
  }

  if (!components || !schema || previousSchemaUrl !== schemaUrl) {
    return <Loading fullScreen />;
  }
  return (
    <ReactRenderer
      className="lowcode-portal-renderer"
      schema={schema.componentsTree[0]}
      components={components}
    />
  );
};

export default PortalRenderer;