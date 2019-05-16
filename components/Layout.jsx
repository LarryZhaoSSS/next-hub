import { useState, useCallback } from 'react'
import { Layout, Icon, Input, Avatar, Tooltip, Dropdown, Menu } from 'antd'
import Container from './Container'
import getConfig from 'next/config'
import { connect } from 'react-redux'
import { logout } from '../store/store'
import { withRouter } from 'next/router'
console.log(getConfig)
const { Header, Content, Footer } = Layout
const { publicRuntimeConfig } = getConfig()
console.log(publicRuntimeConfig)
import axios from 'axios'
function Lay({ children, user, logout, router }) {
  const [search, setSearch] = useState('')
  const handleSearchChange = useCallback(event => {
    setSearch(event.target.value)
  }, [])
  console.log('--------user------')
  console.log(user)
  const handleOnSearch = useCallback(() => {}, [])
  const handleLogout = useCallback(() => {
    logout()
  }, [logout])
  const githubIconStyle = {
    color: 'white',
    fontSize: 40,
    display: 'block',
    paddingTop: 10,
    marginRight: 20
  }
  const handleGotoOAuth = useCallback((e)=>{
    e.preventDefault()
    axios.get(`/prepare-auth?url=${router.asPath}`).then(res=>{
      if (res.status === 200) {
        location.href = publicRuntimeConfig.OAUTH_URL
      } else {
        console.log('jump fail', res)
      }
    }).catch(err=>{
      console.log(err)
    })
    
  },[router])
  const footerStyle = {
    textAlign: 'center'
  }
  const userDropDown = (
    <Menu>
      <Menu.Item>
        <a href='javascript:void(0)' onClick={handleLogout}>
          登 出
        </a>
      </Menu.Item>
    </Menu>
  )
  const Comp = ({ color, children }) => <div style={{ color }}>{children}</div>
  return (
    <Layout>
      <Header>
        <Container element={<div className='header-inner' />}>
          <div className='header-left'>
            <div className='logo'>
              <Icon type='github' style={githubIconStyle} />
            </div>
            <div>
              <Input.Search
                placeholder='搜索仓库'
                value={search}
                onChange={handleSearchChange}
                onSearch={handleOnSearch}
              />
            </div>
          </div>
          <div className='header-right'>
            <div className='user'>
              {user && user.id ? (
                <Dropdown overlay={userDropDown}>
                  <a href='/'>
                    <Avatar size={40} src={user.avatar_url} />
                  </a>
                </Dropdown>
              ) : (
                <Tooltip title='点击登陆'>
                  <a href={`/prepare-auth?url=${router.asPath}`}>
                    <Avatar size={40} icon='user' />
                  </a>
                </Tooltip>
              )}
            </div>
          </div>
        </Container>
      </Header>
      <Content>
        <div className='content'>
          <Container>{children}</Container>
        </div>
      </Content>
      <Footer style={footerStyle}>
        Develop by sss @
        <a href='larryzhao1994@outlook.com'>larryzhao1994@outlook.com</a>
      </Footer>
      <style jsx>
        {`
          .header-inner {
            display: flex;
            justify-content: space-between;
          }
          .header-left {
            display: flex;
            justify-content: flex-start;
          }
        `}
      </style>
      <style jsx global>
        {`
          #__next {
            height: 100%;
          }
          .ant-layout {
            height: 100%;
          }
          .ant-layout-header {
            padding-left: 0;
            padding-right: 0;
          }
        `}
      </style>
    </Layout>
  )
}
export default connect(
  function mapState(state) {
    return {
      user: state.user
    }
  },
  function mapReducer(dispatch) {
    return {
      logout: () => dispatch(logout())
    }
  }
)(withRouter(Lay))
