function Detail () {
  return <span>Detail</span>
}
Detail.getInitialProps = () => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve({})
    },1000)
  })
}
export default Detail