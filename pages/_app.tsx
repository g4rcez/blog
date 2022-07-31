import type { AppProps } from "next/app";
import { Fragment } from "react";
import { Navbar } from "../components/navbar";
import "../styles/globals.css";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Navbar />
      <main className="mt-8">
        <Component {...pageProps} />
      </main>
    </Fragment>
  );
}

export default MyApp;
