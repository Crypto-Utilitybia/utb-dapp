import Layout from 'layout'
import { StoreProvider } from 'contexts/store-context'
import Store from 'containers/Store'
import HeaderMeta from 'parts/HeaderMeta'

export default function StorePage() {
  return (
    <Layout>
      <HeaderMeta />
      <StoreProvider>
        <Store />
      </StoreProvider>
    </Layout>
  )
}
