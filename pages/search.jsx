import { withRouter } from 'next/router'
import { memo } from 'react'
import Router from 'next/router'
import { Row, Col, List } from 'antd'
import Link from 'next/link'
const api = require('../lib/api')
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
const FilterLink = memo(({ name, query, lang, sort, order }) => {
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
  return (
    <Link href={`/search${queryString}`}>
      <a >{name}</a>
    </Link>
  )
})

function Search({ router, repos }) {
  console.log('------search-----')
  console.log(repos)
  const { sort, order, lang} = router.query
  console.log('--------lang')
  console.log(router.query)
  console.log(lang)
  const {...querys} = router.query
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
              {selected}
              return (
                <List.Item
                  style={selected ? selectedItemStyle : null}
                >
                  <FilterLink
                    lang={item}
                    name={item}
                    {...querys}
                  />
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
              } else if (
                item.value === sort &&
                item.order === order
              ) {
                selected = true
              }

              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  <FilterLink sort={item.value} name={item.name} order={item.order} {...querys}/>
                </List.Item>
              )
            }}
          />
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
