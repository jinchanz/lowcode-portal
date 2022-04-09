import React from 'react';
import ReactDOM from 'react-dom';
import { Nav, Shell, Box, Button, Icon } from '@alifd/next';
import { default as PortalRenderer } from '../renderer/renderer';
import './index.scss';

const { useState } = React;

const { 
  menuDataSource, 
  schemaUrl, 
  darkMode, 
  menuStyle: originMenuStyle, 
  headerHeight, 
  blackColor, 
  hideLogo,
  hideTitle,
  logo,
  homepage,
  logoHref,
  logoStyle,
  title,
  titleHref,
  lightColor: initLightColor,
  fullScreen,
} = window.__INIT_STATE__;

const lightColor = initLightColor === '#ffffff00' ? 'white' : initLightColor;

function renderLogo() {
  const href = logoHref || homepage || '';
  return <Box justify="center" className="header-logo" style={logoStyle}>
    <a href={href.startsWith('http') ? href : `/${href}`}>
      <img src={logo || '//img.alicdn.com/tfs/TB1pKookmzqK1RjSZFHXXb3CpXa-240-70.png'} alt="logo" />
    </a>
  </Box>;
}

function renderTitle() {
  const href = titleHref || homepage || '';
  return <Box justify="center" className="title">
  <a 
    style={ { color: darkMode ? 'white' : 'black', textDecoration: 'none' } } 
    href={href.startsWith('http') ? href : `/${href}`}>
    <span className="header-title">{title}</span>
  </a>
</Box>;
}

function openLowcodeEditor() {
  window.open('/admin/lowcode', '_blank');
}

const Home = () => {

  if (fullScreen) {
    return schemaUrl ? <PortalRenderer schemaUrl={schemaUrl} /> : null;
  }

  const [ showMobileNav, setShowMobileNav ] = useState(false);
  const toggleMobileNav = () => {
    setShowMobileNav(!showMobileNav);
  }
  let defaultNav = menuDataSource && menuDataSource[0] && menuDataSource[0].url;
  if (location.pathname && menuDataSource && menuDataSource.length) {
    const currentMenu = menuDataSource.find(item => {
      return location.pathname.includes(item.url);
    });
    if (currentMenu) {
      defaultNav = currentMenu.url;
    }
  }
  let menuStyle = {};
  if (originMenuStyle) {
    menuStyle = {
      ...originMenuStyle,
      color: (originMenuStyle.color || {})[darkMode ? 'dark' : 'light'],
    };
  }

  return (
    <Shell
      className={"lowcode-portal-shell"}
    >
      <Shell.Navigation 
        direction="hoz"
        className="header"
        style={{ 
          background: darkMode ? (blackColor || 'black') : (lightColor || 'white'),
          borderBottom: '1px solid #E6E7EB',
          height: headerHeight || 80,
        }}>
        <div className='header-container' style={{background: darkMode ? (blackColor || 'black') : (lightColor || 'white'),}}>
          <Box direction='row' align='center'>
            <Box spacing={40} direction="row" align="center" style={{ height: '100%' }}>
              {hideLogo ? null : renderLogo()}
              {hideTitle ? null : renderTitle()}
            </Box>
          </Box>
          {
            menuDataSource && menuDataSource.length ?
            <>
              <div className="desktop-nav">
                <Nav
                  mode="popup"
                  direction="hoz"
                  type="line"
                  defaultSelectedKeys={[defaultNav]}
                  triggerType="hover"
                >
                  {
                    menuDataSource.map(item => {
                      return <Nav.Item className={darkMode ? 'dark-nav-item' : ''} key={item.url}>
                        <a href={item.url} target={item.target} >
                          <span style={menuStyle}> {item.label} </span>
                        </a>
                      </Nav.Item>;
                    })
                  }
                </Nav>
              </div>
              { !showMobileNav ? 
                  <div className='mobile-nav-close'>
                    <Button iconSize="large" onClick={toggleMobileNav} ghost={ darkMode ? 'dark' : 'light' }><Icon type="list" /> </Button>
                  </div> :
                  <div className="mobile-nav-open">
                    <div className='mobile-nav-actions' style={{
                      height: headerHeight || 80,
                    }}>
                      <Button iconSize="large" onClick={toggleMobileNav} ghost={ darkMode ? 'dark' : 'light' }><Icon type="close" /> </Button>
                    </div>
                    <Nav
                      mode="popup"
                      defaultSelectedKeys={[menuDataSource[0].label]}
                      triggerType="hover"
                    >
                      {
                        menuDataSource.map(item => {
                          return <Nav.Item className={darkMode ? 'dark-nav-item' : ''} key={item.label}>
                            <a className='mobile-nav-item' href={item.url} target={item.target} >
                              <span style={menuStyle}> {item.label} </span>
                            </a>
                          </Nav.Item>;
                        })
                      }
                    </Nav>
                  </div>
                }
            </> :
            null
          }
        </div>
      </Shell.Navigation>

      <Shell.Content>
        <div className='document-container' style={{marginTop: ((headerHeight || 80) - 72)}}>
          { schemaUrl ? <PortalRenderer schemaUrl={schemaUrl} /> : null }
        <div className='lowcode-action'><Button onClick={openLowcodeEditor}><Icon type='edit' /> 搭建当前页面</Button></div>
        </div>
      </Shell.Content>
    </Shell>
  );
};

ReactDOM.render(<Home />, document.getElementById('ice-container'));
