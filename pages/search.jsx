import { withRouter } from 'next/router'
import { memo, isValidElement } from 'react'
import Router from 'next/router'
import { Row, Col, List, Pagination } from 'antd'
import Link from 'next/link'
const api = require('../lib/api')
import Repo from '../components/Repo'
const LANGUAGES = ['JavaScript', 'TypeScrit', 'Java', 'C++']
const SORT_TYPES = [
  {
    name: 'Best Match'
  },
  {
    name: 'Most Stars',
    value: 'stars',
    order: 'desc'
  },
  {
    name: 'Fewest Stars',
    value: 'stars',
    order: 'asc'
  },
  {
    name: 'Most Forks',
    value: 'forks',
    order: 'desc'
  },
  {
    name: 'Fewest Forks',
    value: 'forks',
    order: 'asc'
  }
]

const selectedItemStyle = {
  borderLeft: `2px solid #e36209`,
  fontWeight: 100
}
const FilterLink = memo(({ name, query, lang, sort, order, page }) => {
  // const doSearch = () => {
  //   console.log('-----in filterlink-----')
  //   Router.push({
  //     pathname: '/search',
  //     query: {
  //       query,
  //       lang,
  //       sort,
  //       order
  //     }
  //   })
  // }

  let queryString = `?query=${query}`
  if (lang) queryString += `&lang=${lang}`
  if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
  if (page) queryString += `&page=${page}`
  queryString += `&per_page=${per_page}`
  return (
    <Link href={`/search${queryString}`}>
      {isValidElement(name) ? name : <a>{name}</a>}
    </Link>
  )
})
function noop() {}
const per_page = 30
function Search({ router, repos }) {
  console.log('------search-----')
  console.log(repos)
  const { sort, order, lang, page } = router.query
  console.log('--------lang')
  console.log(router.query)
  console.log(lang)
  const { ...querys } = router.query

  return (
    <div className='root'>
      <Row gutter={20}>
        <Col span={6}>
          <List
            bordered
            header={<span className='list-header'>languages</span>}
            style={{ marginBottom: 20, marginTop: 40 }}
            dataSource={LANGUAGES}
            renderItem={item => {
              const selected = lang === item
              {
                selected
              }
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  <FilterLink lang={item} name={item} {...querys} />
                </List.Item>
              )
            }}
          />
          <List
            bordered
            header={<span className='list-header'>order</span>}
            dataSource={SORT_TYPES}
            style={{ marginBottom: 70 }}
            renderItem={item => {
              let selected = false
              if (item.name === 'Best match' && !sort) {
                selected = true
              } else if (item.value === sort && item.order === order) {
                selected = true
              }

              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  <FilterLink
                    sort={item.value}
                    name={item.name}
                    order={item.order}
                    {...querys}
                  />
                </List.Item>
              )
            }}
          />
        </Col>
        <Col span={18}>
          <h3 className='repos-title'>{repos.total_count}个仓库</h3>
          {repos.items.map(repo => (
            <Repo repo={repo} key={repo.id} />
          ))}
          <div className='pagination'>
            <Pagination
              pageSize={per_page}
              current={Number(page) || 1}
              total={repos.total_count>1000?1000:repos.total_count}
              onChange={noop}
              itemRender={(page, type, ol) => {
                const p =
                  type === 'page' ? page : type === 'prev' ? page - 1 : page + 1
                const name = type === 'page' ? page : ol
                return <FilterLink {...querys} page={p} name={name} />
              }}
            />
          </div>
        </Col>
      </Row>
      <style jsx>{`
        .root {
          padding: 20px 0;
        }
        .list-header {
          font-weight: 800;
          font-size: 16px;
        }
        .repos-title {
          border-bottom: 1px solid #eee;
          font-size: 24px;
          line-height: 50px;
        }
        .pagination {
          padding: 20px;
          text-align:center;
        }
      `}</style>
    </div>
  )
}
Search.getInitialProps = async ({ ctx }) => {
  const { query, sort, lang, order, page } = ctx.query
  if (!query) {
    return {
      repos: {
        total_count: 0
      }
    }
  }
  let queryString = `?q=${query}`
  if (lang) queryString += `&lang${lang}`
  if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
  if (page) queryString += `&page=${page}`
  queryString += `&per_page=${per_page}`

  const result = await api.request(
    {
      url: `/search/repositories${queryString}`
    },
    ctx.req,
    ctx.res
  )
  return {
    repos: result.data
  }
}
export default withRouter(Search)
