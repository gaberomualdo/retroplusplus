import Head from "next/head";
import Hero from "../components/hero";
import { makeTitle } from "../lib/util";

export default function Home() {
  return (
    <>
      <Head>
        <title>{makeTitle("")}</title>
      </Head>
      <Hero />
    </>
  );
}
