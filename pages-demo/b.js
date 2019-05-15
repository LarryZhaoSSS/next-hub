import React, { useState, useReducer, useContext,useRef, useEffect } from 'react'
import myContext from './lib/my-context'
function countReducer(state, action) {
  switch (action.type) {
    case 'add':
      return state + 1
    case 'minus':
      return state - 1
    default:
      return state
  }
}
function MyCountFunc() {
  // const [count, setCount] = useState(0)
  const [count, dispatchCounter] = useReducer(countReducer, 100)
  const [name, setName] = useState('larryzhao')
  const context = useContext(myContext)
  const inputRef = useRef()
  // useEffect(()=>{
  //   const interval = setInterval(()=>{
  //     // setCount(c=>c + 1)
  //     dispatchCounter({type:'minus'})
  //   },1000)
  //   return () => {
  //     clearInterval(interval)
  //   }
  // },[])
  useEffect(() => {
    console.log('effect invoke')
    console.log(inputRef)
    return () => console.log('effect detect')
  }, [name])
  return (
    <div>
      <input
        value={name}
        ref={inputRef}
        onChange={e => {
          setName(e.target.value)
        }}
      />
      <span onClick={() => dispatchCounter({ type: 'add' })}>{count}</span>
      <p>{context}</p>
    </div>
  )
}
export default MyCountFunc
