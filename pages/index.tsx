import { Layout, ConfigProvider, theme } from 'antd'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Content } from '../components/Content'
import { AppContextProvider } from '../context/appStore'

const { darkAlgorithm } = theme
const darkTheme = {
  algorithm: darkAlgorithm,
  token: {
    colorPrimary: '#87cefb',
    colorLinkHover: '#87cefb',
  },
}

export default function Home() {
  return (
    <ConfigProvider theme={darkTheme}>
      <AppContextProvider>
        <Layout className="h-full">
          <Header title={'Lottery Game'}/>
          {/* <Content/> */}
          <Footer/>
        </Layout>
      </AppContextProvider>
    </ConfigProvider>
  )
}
