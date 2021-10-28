import Head from 'next/head'

import Layout from 'layout'
import axios from 'services/axios'
import CoinDetail from 'containers/CoinDetail'
import { defaultNetwork } from 'library/constants'

export default function CoinPage({ coinMeta }) {
  return (
    <Layout>
      <Head>
        <meta property="og:url" content={coinMeta.external_url} />
        <meta property="og:title" content={coinMeta.name} />
        <meta property="og:description" content={coinMeta.description} />
        <meta
          property="og:image"
          content={`https://avaxcoins.com${coinMeta?.image || NO_IMAGE_PATH}?timestamp=${Date.now()}`}
        />

        <meta property="twitter:url" content={coinMeta.external_url} />
        <meta property="twitter:title" content={coinMeta.name} />
        <meta property="twitter:description" content={coinMeta.description} />
        <meta
          property="twitter:image"
          content={`https://avaxcoins.com${coinMeta?.image || NO_IMAGE_PATH}?timestamp=${Date.now()}`}
        />
      </Head>
      <CoinDetail coinMeta={coinMeta} />
    </Layout>
  )
}

CoinPage.getInitialProps = async ({ query }) => {
  try {
    const { data: coinMeta = {} } = await axios.get(
      `/api/avaxcoin/${query.tokenId}?network=${query.network || defaultNetwork}`
    )
    return { coinMeta }
  } catch (error) {
    console.log(error)
  }
}
