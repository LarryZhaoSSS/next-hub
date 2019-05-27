import withRepoBasic from '../../components/with-repo-basic'
// export default ()=> {
//   return <span>Detail Index</span>
// }
function Issues({ text }) {
  return <span>Issues index-{text}</span>
}
Issues.getInitialProps = async () => {
  return {
    text: 123
  }
}
export default withRepoBasic(Issues, 'issues')
