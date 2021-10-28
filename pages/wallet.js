import Layout from 'layout'
import Wallet from 'containers/Wallet'
import HeaderMeta from 'parts/HeaderMeta'

export default function WalletPage() {
  return (
    <Layout>
      <HeaderMeta />
      <Wallet />
    </Layout>
  )
}