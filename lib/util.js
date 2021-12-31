import {
  CheckCircleIcon,
  ChevronDoubleRightIcon,
  QuestionMarkCircleIcon,
  ThumbUpIcon,
} from "@heroicons/react/outline";
import config from "./config";

export function classes(...x) {
  return x.join(" ");
}
export function checkPinExists(pin) {
  return new Promise((resolve) => {
    if (process.browser) {
      window.database
        .ref(pin)
        .once("value")
        .then((snapshot) => {
          resolve(snapshot.val() !== null);
        });
    } else {
      resolve(true);
    }
  });
}
const newPin = () => (Math.floor(Math.random() * 90000) + 10000).toString();
export async function newRetro() {
  let pin = newPin();
  while (await checkPinExists(pin)) {
    pin = newPin();
  }
  await window.database.ref(pin).set({
    0: {
      type: "retro-started",
    },
  });
  window.open(`/${pin}`, "_self");
}
export function makeTitle(title) {
  if (title.length === 0) return config.name;
  return `${title} • ${config.name}`;
}

export const steps = [
  {
    id: "brainstorm",
    name: "Brainstorm",
  },
  {
    id: "move",
    name: "Move & Prioritize",
  },
  {
    id: "actions",
    name: "Discuss & Add Actions",
  },
  {
    id: "review",
    name: "Review",
  },
];

export const columns = [
  {
    id: "went-well",
    name: "What went well?",
    title: "What went well",
    desc: "Double down on these and keep doing them.",
    icon: ThumbUpIcon,
  },
  {
    id: "to-improve",
    name: "What could we improve?",
    title: "We could improve on",
    desc: "Write down actions we can take to improve these.",
    icon: ChevronDoubleRightIcon,
  },
  {
    id: "questions",
    name: "What questions do I have?",
    title: "What questions we have",
    desc: "Discuss answers to these questions.",
    icon: QuestionMarkCircleIcon,
  },
  {
    id: "actions",
    name: "What should we start doing?",
    title: "We should start doing",
    icon: CheckCircleIcon,
  },
];

export const formatNum = (n) =>
  n.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
