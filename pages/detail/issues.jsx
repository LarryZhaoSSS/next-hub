import withRepoBasic from '../../components/with-repo-basic'
import dynamic from 'next/dynamic'
import { useState, useCallback } from 'react'
import api from '../../lib/api'
import { Avatar, Button, Select } from 'antd'
import SearchUser from '../../components/SearchUser'
const MdRenderer = dynamic(() => import('../../components/MarkdownRender'))
function IssueDetail({ issue }) {
  return (
    <div className='root'>
      <MdRenderer content={issue.body} />
      <div className='actions'>
        <Button href={issue.html_url} target='_blank'>
          打开Issue页面
        </Button>
      </div>
      <style jsx>{`
        .root {
          background: #fefefe;
          padding: 20px;
        }
        .actions {
          text-align: right;
        }
      `}</style>
    </div>
  )
}
function IssueItem({ issue }) {
  const [showDetail, setShowDetail] = useState(false)
  const toggleShowDetail = useCallback(() => {
    setShowDetail(detail => !detail)
  }, [])
  console.log('--------inIssue----item----')
  console.log(issue)
  return (
    
    <div>
      <div className='issue'>
        <Button
          type='primary'
          size='small'
          style={{ position: 'absolute', right: 10, top: 10 }}
          onClick={toggleShowDetail}
        >
          {showDetail ? '隐藏' : '查看'}
        </Button>
        <div className='avatar'>
          <Avatar src={issue.user.avatar_url} shape='square' size={50} />
        </div>
        <div className='main-info'>
          <h6>
            <span>{issue.title}</span>
            {
              issue.labels.map(label=><Label label={label} key={label.id}/>)
            }
          </h6>
          <p className='sub-info'>
            <span>Updated at {issue.updated_at}</span>
          </p>
        </div>
      </div>
      {showDetail ? <IssueDetail issue={issue} /> : null}
      <style jsx>{`
        .issue {
          display: flex;
          position: relative;
          padding: 10px;
        }
        .issue:hover {
          background: #fafafa;
        }
        .issue + .issue {
          border-top: 1px solid #eee;
        }
        .main-info > h6 {
          max-width: 600px;
          font-size: 16px;
          padding-right: 40px;
        }
        .avatar {
          margin-right: 20px;
        }
        .sub-info {
          margin-bottom: 0;
        }
        .sub-info > span + span {
          display: inline-block;
          margin-left: 20px;
          font-size: 12px;
        }
      `}</style>
    </div>
  )
}
function makeQuery(creator, state,labels) {
  let creatorStr = creator ? `creator=${creator}`:''
  let stateStr = state ? `state=${state}`:''
  let labelStr = ``
  if (labels && labels.length > 0) {
    labelStr = `labels=${labels.join(',')}`
  }
  const arr = []
  if (creatorStr) arr.push(creatorStr)
  if(stateStr) arr.push(stateStr)
  if(labelStr) arr.push(labelStr)
  return `?${arr.join('&')}`
}
function Label({label}) {
  return (
    <>
      <span className='label' style={{ backgroundColor: '#${label.color }'}}>
        {label.name}
      </span>
      <style jsx>{`
        .label {
          display: inline-block;
          line-height: 20px;
          margin-left: 15px;
          padding:3px 10px;
          border-radius: 3px;
          font-size: 14px;
        }
        
      `}</style>
    </>
  )
}
const Option = Select.Option
function Issues({ initialIssues, labels,owner,name }) {
  console.log(labels)
  const [creator, setCreator] = useState()
  const [state, setState] = useState()
  const [label, setLabel] = useState([])
  const [issues, setIssues] = useState(initialIssues)
  const handleCreatorChange = useCallback(value => {
    setCreator(value)
  }, [])
  const handleStateChange = useCallback(value => {
    setState(value)
  }, [])
  const handleLabelChange = useCallback(value => {
    setLabel(value)
  }, [])
  const handleSearch = () => {
     api.request(
      {
        url: `/repos/${owner}/${name}/issues/${makeQuery(creator,state,label)}`
      }
    ).then(resp => setIssues(resp.data))
  }
  return (
    <div className='root'>
      <div className='search'>
        <SearchUser onChange={handleCreatorChange} value={creator} />
        <Select
          placeholder='状态'
          onChange={handleStateChange}
          value={state}
          style={{ width: 200, marginLeft: 30 }}
        >
          <Option value='all'>all</Option>
          <Option value='open'>open</Option>
          <Option value='closed'>closed</Option>
        </Select>
        <Select
          placeholder='label'
          mode='multiple'
          style={{ flexGrow: 1, marginLeft: 30, marginRight: 30 }}
          onChange={handleLabelChange}
          value={label}
        >
          {labels.map(la => (
            <Option value={la.name} key={la.id}>
              {la.name}
            </Option>
          ))}
        </Select>
        <Button type='primary' onClick={handleSearch}>搜索</Button>
      </div>

      <div className='issues'>
        {issues.map(issue => (
          <IssueItem issue={issue} key={issue.id} />
        ))}
      </div>
      <style jsx>
        {`
          .issues {
            border: 2px solid #eee;
            border-radius: 5px;
            margin-bottom: 20px;
            margin-top: 20px;
          }
          .search {
            display: flex;
          }
        `}
      </style>
    </div>
  )
}
Issues.getInitialProps = async ({ ctx }) => {
  const { owner, name } = ctx.query
  // const issuesResp = await api.request(
  //   {
  //     url: `/repos/${owner}/${name}/issues`
  //   },
  //   ctx.req,
  //   ctx.res
  // )
  // const labelsResp = await api.request({
  //   url:`/repos/${owner}/${name}/labels`
  // }, ctx.req, ctx.res)
  const fetches = await Promise.all([
    await api.request(
      {
        url: `/repos/${owner}/${name}/issues`
      },
      ctx.req,
      ctx.res
    ),
    await api.request(
      {
        url: `/repos/${owner}/${name}/labels`
      },
      ctx.req,
      ctx.res
    )
  ])
  return {
    text: 123,
    initialIssues: fetches[0].data,
    owner,
    name,
    labels: fetches[1].data
  }
}
export default withRepoBasic(Issues, 'issues')
