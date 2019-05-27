import withRepoBasic from '../../components/with-repo-basic'
// export default ()=> {
//   return <span>Detail Index</span>
// }
function Detail ({text}) {
  return <span>detail index-{text}</span>
}
Detail.getInitialProps = async ()=> {
  return {
    text: 123
  }
}
export default withRepoBasic(Detail, 'index')
