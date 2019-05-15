import App, { Container } from 'next/app'
import {Provider} from 'react-redux'
import 'antd/dist/antd.css'
import Layout from '../components/Layout'
import store from '../store/store'
import MyContext from './lib/my-context'
class MyApp extends App {
  state = {
    context: 'value'
  }
  static async getInitialProps(ctx) {
    const { Component } = ctx
    console.log('app init')
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {
      pageProps
    }
  }
  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Layout>
          <Provider store={store}>
            <MyContext.Provider value={this.state.context}>
              <Component {...pageProps} />
              <div
                onClick={() =>
                  this.setState({ context: `${this.state.context}+1111` })
                }
              >
                点我吧111
              </div>
            </MyContext.Provider>
          </Provider>
        </Layout>
      </Container>
    )
  }
}
export default MyApp
