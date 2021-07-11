import Head from 'next/head'
import { ApolloProvider } from 'react-apollo'
import { client } from '@lib/queries'
import Header from '@components/Header/Header'
import Footer from '@components/Footer/Footer'
import '@styles/globals.css'
import '@styles/common.css'

function Application({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Crypto Utilitybia</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header title="Welcome to my app!" />

      <main>
        <Component {...pageProps} />
      </main>

      <Footer />
    </ApolloProvider>
  )
}

export default Application
