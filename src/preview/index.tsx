import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
  useNavigate,
} from 'react-router-dom'
import { Nav, Shell } from '@alifd/next';

import { listFiles } from '../apis/file';
import { default as PortalRender } from '../renderer/renderer';
import './index.scss';

const basePath = '/admin/preview.html';

const SamplePreview = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { page } = params;
  const [ files, setFiles ] = useState([]);
  const [ schemaUrl, setSchemaUrl ] = useState();

  useEffect(() => {
    async function getFiles() {
      const files = await listFiles();
      if (!page && files?.length) {
        navigate(`${files[0]?.locator || ''}`);
      }
      setFiles(files);
    }
    getFiles();
  }, []);

  useEffect(() => {
    const getSchemaByFileLocator = async () => {
      const file = files?.find?.(item => item.locator === page);
      file?.schema_url && setSchemaUrl(file.schema_url);
    };
    if (files?.length) {
      getSchemaByFileLocator();
    }
  }, [page, files]);

  return (
    <div className="lowcode-portal-preview">
      <Shell
        className={"lowcode-portal-shell"}
        style={{ border: "1px solid #eee" }}
      >
        <Shell.Action>
          <span style={{ marginLeft: 10 }}>MyName</span>
        </Shell.Action>

        <Shell.Navigation>
          <Nav type='line' selectedKeys={[page || files?.[0]?.locator || '']}>
            {
              files.length ? files.map(file => {
                const disabled = !file?.locator || !file?.schema_url;
                return <Nav.Item disabled={disabled} key={file.locator} >
                  { disabled ? file.name : <Link to={`${basePath}/${file.locator}`} >{file.name} </Link> }
                </Nav.Item>
              })
              : null
            }
          </Nav>
        </Shell.Navigation>

        <Shell.Content>
          {
            schemaUrl ? <PortalRender schemaUrl={schemaUrl} /> : null
          }
        </Shell.Content>
      </Shell>

    </div>
  );
};

ReactDOM.render(<Router>
  <Routes>
    <Route path={`${basePath}`} element={<SamplePreview />} />
    <Route path={`${basePath}/:page`} element={<SamplePreview />} />
  </Routes>
</Router>, document.getElementById('ice-container'));
