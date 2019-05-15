import { withRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
const Title = styled.h1 `
color: yellow;
background: pink;
`


const A = ({ router, name, time }) => {

  return (
    <>
    <Title>Title component  { time }</Title>
      <Link href='#aaa'>
        <a className='link'>
          A {router.query.id} {name} 
        </a>
      </Link>
      <style jsx>
      {`
        a {
          color: red;
          background: pink;
        }
      `}
      </style>
    </>
  )
}

A.getInitialProps = async ctx => {
  const moment = await import('moment')
  const promise = new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: 'jokcy',
        time: moment.default(Date.now() - 60 * 1000 * 60).fromNow()
      })
    }, 1000)
  })

  return await promise
}

export default withRouter(A)
