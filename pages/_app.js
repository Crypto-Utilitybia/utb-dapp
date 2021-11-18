import Head from 'next/head'
import Layout from 'layout'

import 'styles/global.css'

function UtiltiybiaApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
        <meta name="version" content={process.env.NEXT_PUBLIC_APP_VERSION} />

        <meta charSet="utf-8" />
        <meta name="keywords" content="utilityDriven,NFT,utilitybia" />
        <meta name="description" content="World's fist utility service using NFTs!" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="628" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />

        <link rel="apple-touch-icon" sizes="57x57" href="/metadata/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/metadata/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/metadata/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/metadata/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/metadata/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/metadata/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/metadata/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/metadata/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/metadata/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/metadata/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/metadata/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/metadata/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/metadata/favicon-16x16.png" />
        <link rel="manifest" href="/metadata/manifest.json" />
        <meta name="msapplication-config" content="/metadata/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/metadata/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
          referrerPolicy="no-referrer"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

UtiltiybiaApp.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
  return { pageProps }
}

export default UtiltiybiaApp
