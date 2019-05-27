const api = require('../lib/api')
import { useEffect } from 'react'
import LRU from 'lru-cache'
import { Button, Icon, Tabs } from 'antd'
import getConfig from 'next/config'
import { connect } from 'react-redux'
import Router, { withRouter } from 'next/router'
const { publicRuntimeConfig } = getConfig()
import Repo from '../components/Repo'
import {cacheArray} from '../lib/repo-basic-cache'
let cachedUserRepos, cachedUserStarredRepos
const cache = new LRU({
  maxAge: 10 * 60 *1000
})
function Index({ userRepos, userStarredRepos, user, router }) {
  console.log('userRepos')
  console.log(userRepos)
  console.log(user)
  console.log('--star---')
  console.log(userStarredRepos)
  const tabKey = router.query.key || '1'
  const handleTabChange = activeKey => {
    Router.push(`/?key=${activeKey}`)
  }
  useEffect(() => {
    if (!isServer) {
      cache.set('userRepos', userRepos)
      cache.set('userStarredReops',userStarredRepos)
    }
  }, [userRepos, userStarredRepos])
  useEffect(()=>{
    if (!isServer) {
      cacheArray(userRepos)
      cacheArray(userStarredRepos)
    }
  })
  if (!user || !user.id) {
    return (
      <div className='root'>
        <p>还未登陆</p>
        <Button type='primary' href={publicRuntimeConfig.OAUTH_URL}>
          点击登陆
        </Button>
        <style jsx>
          {`
            .root {
              height: 400px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 20px 0;
            }
          `}
        </style>
      </div>
    )
  }
  return (
    <div className='root'>
      <div className='user-info'>
        <img src={user.avatar_url} alt='user avatar' className='avatar' />
        <span className='login'>{user.login}</span>
        <span className='name'>{user.name}</span>
        <span className='bio'>{user.bio}</span>
        <p className='email'>
          <Icon type='mail' style={{ marginRight: 10 }} />
          <a href={`mail:${user.email}`}>1658977155@qq.com</a>
        </p>
      </div>
      <div className='user-repos'>
        <Tabs activeKey={tabKey} onChange={handleTabChange} animated={false}>
          <Tabs.TabPane tab='你的仓库' key='1'>
            {userRepos.map(repo => {
              return <Repo repo={repo} key={repo.id} />
            })}
          </Tabs.TabPane>
          <Tabs.TabPane tab='你关注仓库' key='2'>
            {userStarredRepos.map(repo => {
              return <Repo repo={repo} key={repo.id} />
            })}
          </Tabs.TabPane>
        </Tabs>
      </div>
      <style jsx>{`
        .root {
          display: flex;
          align-items: flex-start;
          margin-top: 20px;
        }
        .user-info {
          width: 200px;
          margin-right: 40px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }
        .login {
          font-weight: 800;
          size: 20px;
          margin-top: 20px;
        }
        .name {
          font-size: 16px;
          color: #777;
        }
        .bio {
          margin-top: 20px;
          color: #333;
        }
        .avatar {
          width: 100%;
          border-radius: 5px;
        }
        .user-repos {
          flex-grow: 1;
        }
      `}</style>
    </div>
  )
}
const isServer = typeof window === 'undefined'
Index.getInitialProps = async ({ ctx, reduxStore }) => {
  const user = reduxStore.getState().user
  if (!user || !user.id) {
    return {
      isLogin: false
    }
  } else {
    if (!isServer) {
      if (cache.get('userRepos') && cache.get('userStarredRepos')) {
        return {
          userRepos: cache.get('userRepos'),
          userStarredRepos: cache.get('userStarredRepos')
        }
      }
    }

    const userRepos = await api.request(
      {
        url: `/user/repos`
      },
      ctx.req,
      ctx.res
    )
    const starResult = await api.request(
      {
        url: '/user/starred'
      },
      ctx.req,
      ctx.res
    )

    return {
      userRepos: userRepos.data,
      userStarredRepos: starResult.data,
      isLogin: true
    }
  }
}
export default connect(function mapState(state) {
  return {
    user: state.user
  }
})(withRouter(Index))
