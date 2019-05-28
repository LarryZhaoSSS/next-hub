import withRepoBasic from '../../components/with-repo-basic'
const api = require('../../lib/api')
import dynamic from 'next/dynamic'
const MDRenderer = dynamic(()=>import('../../components/MarkdownRender'))


function Detail ({readme}) {
  return (
     <MDRenderer content={readme.content} isBase64={true}/>
  )
  
}
Detail.getInitialProps = async ({ctx:{query:{owner,name}, req, res}})=> {
  const readmeResp = await api.request({
    url:`/repos/${owner}/${name}/readme`
  }, req, res)
  return {
    readme: readmeResp.data
  }
}
export default withRepoBasic(Detail, 'index')
