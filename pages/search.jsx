import { withRouter } from 'next/router'
import { Row, Col, List} from 'antd'
import Link from 'next/link'
const api = require('../lib/api')
const LANGUAGES = ['JavaScript', 'TypeScrit', 'Java','C++']
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
function Search({ router, repos }) {
  console.log('------search-----')
  console.log(repos)
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
              return (
                <List.Item>
                  <Link href='/search'>
                    <a href=''>{item}</a>
                  </Link>
                </List.Item>
              )
            }}
          />
          <List
            bordered
            header={<span className='list-header'>order</span>}
            dataSource={SORT_TYPES}
            style={{marginBottom: 70}}
            renderItem={item=>{
              return (
                <List.Item>
                  <Link href="/search">
                    <a href="">{item.name}</a>
                  </Link>
                </List.Item>
              )
            }}
          />
        </Col>
      </Row>
    </div>
  )
}
Search.getInitialProps = async ({ctx}) => {
  const { query, sort, lang, order, page } = ctx.query
  if (!query) {
    return {
      repos: {
        total_count: 0
      }
    }
  }
  let queryString = `?q=${query}`
  if (lang) queryString += `+language:${lang}`
  if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
  if (page) queryString += `&page=${page}`
  const result = await api.request({
    url: `/search/repositories${queryString}`
  }, ctx.req, ctx.res)
  return {
    repos: result.data
  }
}
export default withRouter(Search)
