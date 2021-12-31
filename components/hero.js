import CTA from "./cta";
import Features from "./features";
import Header from "./header";
import MainHero from "./mainhero";
import Footer from "./footer";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  AnnotationIcon,
  ChatAlt2Icon,
  ChatAltIcon,
  CursorClickIcon,
  DocumentReportIcon,
  HeartIcon,
  InboxIcon,
  LightningBoltIcon,
  MenuIcon,
  PencilAltIcon,
  QuestionMarkCircleIcon,
  ReplyIcon,
  SparklesIcon,
  TrashIcon,
  UsersIcon,
  XIcon,
} from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Hero() {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <MainHero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
