import Head from "next/head";
import Hero from "../components/Hero";
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
