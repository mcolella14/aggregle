import '../styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import Layout from '../components/layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Aggregle</title>
        <meta name="description" content="MongoDB Aggregation Pipeline Game" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
