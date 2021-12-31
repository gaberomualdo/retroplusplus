/* eslint-disable @next/next/no-sync-scripts */
import "tailwindcss/tailwind.css";
import "../styles/globals.css";

import React from "react";

import Head from "next/head";
import { uuid } from "uuidv4";

import config from "../lib/config";

class FirebaseProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    const { FIREBASE_CONFIG } = config;
    firebase.initializeApp(FIREBASE_CONFIG);
    window.database = firebase.database();
    this.setState({ loaded: true });

    if (localStorage.getItem("retroplusplus-client-id") === null) {
      localStorage.setItem("retroplusplus-client-id", uuid());
    }
  }
  render() {
    return (
      <>
        <Head>
          <script src="https://www.gstatic.com/firebasejs/7.22.1/firebase-app.js"></script>
          <script src="https://www.gstatic.com/firebasejs/7.22.1/firebase-database.js"></script>
        </Head>
        {this.state.loaded ? (
          this.props.children
        ) : (
          <div className="flex items-center justify-center w-full h-screen">
            <h1 className="text-3xl">Loading...</h1>
          </div>
        )}
      </>
    );
  }
}
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <FirebaseProvider>
        <Component {...pageProps} />
      </FirebaseProvider>
    </>
  );
}
