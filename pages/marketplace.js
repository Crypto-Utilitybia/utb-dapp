import Layout from 'layout'
import Marketplace from 'containers/Marketplace'
import HeaderMeta from 'parts/HeaderMeta'

export default function MarketplacePage() {
  return (
    <Layout>
      <HeaderMeta />
      <Marketplace />
    </Layout>
  )
}