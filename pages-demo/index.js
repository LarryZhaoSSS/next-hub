import Link from 'next/link'
import Router from 'next/router'
import { Button } from 'antd'
import store from '../store/store'
import {connect} from 'react-redux'
const events = [
  'routeChangeStart',
  'routeChangeComplete',
  'routeChangeError',
  'beforeHistoryChange',
  'hashChangeStart',
  'hashChangeComplete',
]

function makeEvent(type) {
  return (...args) => {
    console.log(type, ...args)
  }
}
events.forEach(event => {
  Router.events.on(event, makeEvent(event))
})

const Index= ({count})=> {
  function goToA(){
    Router.push({
      pathname:'/a',
      query:{
        id:2
      }
    },'/a/2')
  }
  function goToB(){
    Router.push({
      pathname:'/b',
      
    })
  }
  return (
    <>
      <Button onClick={goToA}>jump to a</Button>
      <Button onClick={goToB}>jump to b</Button>
      <div>count: {count}</div>
    </>
  )
}
 const mapStateToProps = (state) =>{
   return {
     count: state.count
   }
 }
export default connect(mapStateToProps)(Index)