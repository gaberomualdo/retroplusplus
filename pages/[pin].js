import { CheckIcon, ClipboardCheckIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";

import Card from "../components/card";
import Head from "next/head";
import { useRouter } from "next/router";

import Retro from "../lib/Retro";
import {
  checkPinExists,
  makeTitle,
  steps,
  columns,
  boxStyles,
  formatNum,
} from "../lib/util";
import { uuid } from "uuidv4";
import {
  ChevronRightIcon,
  ClipboardCopyIcon,
  DownloadIcon,
} from "@heroicons/react/solid";

const asArray = (e) => {
  if (!e) return [];
  return Object.keys(e)
    .sort()
    .map((key) => e[key]);
};
const newEventID = () => new Date().getTime().toString() + uuid();

const RetroPage = () => {
  const router = useRouter();
  const { pin } = router.query;
  const [retro, setRetro] = useState(null);
  const [clientID, setClientID] = useState("");
  const [copied, setCopied] = useState(false);
  const [focusedColumn, setFocusedColumn] = useState(null);
  const [highlightedCardID, setHighlightedCardID] = useState(null);

  const addEvent = async (evt, callback = () => {}) => {
    const db = firebase.database();
    const { pin } = router.query;
    if (pin === undefined) return;
    await db.ref(`${pin}/${newEventID()}`).set(evt);
    await callback();
  };

  useEffect(() => {
    (async () => {
      const db = firebase.database();
      const { pin } = router.query;
      if (pin === undefined) return;
      if (!(await checkPinExists(pin))) {
        window.open("/", "_self");
      }
      const clientID = localStorage.getItem("retroplusplus-client-id");
      setClientID(clientID);
      const pinRef = db.ref(pin);
      // TODO: move to 'child added' event to make this more performant
      pinRef.on("value", (snapshot) => {
        const events = asArray(snapshot.val());
        const newRetro = new Retro(events);
        setRetro(newRetro);
      });
    })();
  }, [router.query]);

  if (!retro) {
    return (
      <div className="flex items-center justify-center h-screen w-full text-2xl text-gray-700 font-semibold">
        Loading...
      </div>
    );
  }

  if (!retro.users.includes(clientID)) {
    addEvent({
      type: "user-joined",
      clientID,
    });
  }

  const getStepStatus = (stepID) => {
    const retroStepIx = steps.findIndex((e) => e.id === retro.step);
    const stepIx = steps.findIndex((e) => e.id === stepID);
    if (retro.step === stepID) {
      return "current";
    } else if (retroStepIx > stepIx) {
      return "complete";
    } else {
      return "incomplete";
    }
  };
  const setStep = (step) => addEvent({ type: "set-step", step });
  const currentStepIx = steps.findIndex((e) => e.id === retro.step);

  const getCardsInColumn = (columnID) => {
    const getUpvotes = (card) => card.upvoters.length - card.downvoters.length;
    let cards = retro.getCards().filter((e) => e.parentCardID === columnID);
    if (retro.step === "actions" || retro.step === "review") {
      cards.sort((a, b) => getUpvotes(b) - getUpvotes(a));
    }
    return cards;
  };

  return (
    <>
      <Head>
        <title>{makeTitle(`Retro ${pin || ""}`)}</title>
      </Head>
      <div className="w-full min-h-screen flex flex-col bg-gray-100">
        <div
          className="z-50 sticky top-0 w-full border-gray-200 shadow-md bg-white flex justify-between items-center h-20 px-4"
          style={{ flexShrink: 0 }}
        >
          <div className="flex items-center">
            <a href="/">
              <img
                src="/logo.png"
                alt="Retro++"
                className="hidden xl:block h-8 w-auto mr-8"
              />
            </a>
            <ol
              role="list"
              className="lg:border lg:border-gray-200 rounded-md md:flex"
            >
              {steps.map((step, stepIdx) => (
                <li key={step.name} className="relative flex">
                  {getStepStatus(step.id) === "complete" ? (
                    <button
                      onClick={() => setStep(step.id)}
                      className="hidden lg:flex px-4 group items-center w-full"
                    >
                      <span className="justify-center py-1 flex items-center text-sm font-medium">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-purple-600 rounded-full group-hover:bg-purple-800">
                          <CheckIcon
                            className="w-6 h-6 text-white"
                            aria-hidden="true"
                          />
                        </span>
                        <span className="ml-4 text-sm font-medium text-gray-900">
                          {step.name}
                        </span>
                      </span>
                    </button>
                  ) : getStepStatus(step.id) === "current" ? (
                    <button
                      onClick={() => setStep(step.id)}
                      className="flex px-4 justify-center bg-gray-100 border border-gray-200 rounded py-2 lg:py-1 lg:rounded-none lg:bg-white lg:border-none items-center text-sm font-medium"
                      aria-current="step"
                    >
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-purple-600 rounded-full">
                        <span className="w-3 h-3 flex rounded-full bg-purple-600"></span>
                      </span>
                      <span className="ml-4 text-sm font-medium text-purple-600">
                        {step.name}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setStep(step.id)}
                      className="hidden lg:flex px-4 group items-center"
                    >
                      <span className="justify-center py-1 flex items-center text-sm font-medium">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-gray-200 rounded-full group-hover:border-gray-400"></span>
                        <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                          {step.name}
                        </span>
                      </span>
                    </button>
                  )}

                  {stepIdx !== steps.length - 1 ? (
                    <>
                      {/* Arrow separator for lg screens and up */}
                      <div
                        className="hidden lg:block h-12 w-5 flex-initial shrink-0"
                        aria-hidden="true"
                      >
                        <svg
                          className="h-full w-full text-gray-200"
                          viewBox="0 0 22 80"
                          fill="none"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M0 -2L20 40L0 82"
                            vectorEffect="non-scaling-stroke"
                            stroke="currentcolor"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex">
            <button
              type="button"
              className={
                (copied ? "text-purple-600" : "text-gray-700") +
                " transition-all hidden xl:inline-flex items-center px-3 py-2 bg-gray-200 text-sm rounded outline-none bg-white hover:bg-gray-300"
              }
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 1000);
              }}
            >
              {copied ? "Copied!" : "Copy URL"}
              {copied ? (
                <ClipboardCheckIcon
                  className="ml-2 -mr-1 h-5 w-5"
                  aria-hidden="true"
                />
              ) : (
                <ClipboardCopyIcon
                  className="ml-2 -mr-1 h-5 w-5"
                  aria-hidden="true"
                />
              )}
            </button>
            {currentStepIx < steps.length - 1 ? (
              <button
                onClick={() => setStep(steps[currentStepIx + 1].id)}
                type="button"
                className="ml-3 transition-all inline-flex items-center px-3 py-2 border border-transparent text-sm rounded text-white bg-purple-600 hover:bg-purple-700 outline-none"
              >
                Next Step
                <ChevronRightIcon
                  className="ml-1 -mr-1 h-5 w-5"
                  aria-hidden="true"
                />
              </button>
            ) : (
              <button
                onClick={() => window.open("/", "_self")}
                type="button"
                className="ml-3 transition-all inline-flex items-center px-3 py-2 border border-transparent text-sm rounded text-white bg-purple-600 hover:bg-purple-700 outline-none"
              >
                Start a New Retro
                <ChevronRightIcon
                  className="ml-1 -mr-1 h-5 w-5"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        </div>
        <div
          className={
            retro.step === "review"
              ? "flex-1 p-4 flex"
              : "p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xl:flex flex-1"
          }
        >
          {retro.step === "review" ? (
            <div
              className="p-8 bg-white rounded-lg shadow-lg overflow-scroll"
              style={{
                maxWidth: "800px",
                width: "95%",
                margin: "0 auto",
              }}
            >
              {columns.map((col, i) => {
                let cards = getCardsInColumn(col.id);
                if (cards.length === 0) return null;

                return (
                  <>
                    <h1 className="text-2xl font-semibold capitalize">
                      {col.title}
                    </h1>
                    <ul className="list-disc pl-8 py-2 pb-8">
                      {cards.map((c) => {
                        const subCards = retro
                          .getCards()
                          .filter((e) => e.parentCardID === c.id);
                        return (
                          <>
                            <li className="text-lg text-gray-600">{c.text}</li>
                            {subCards.map((sc) => (
                              <li className="text-lg text-gray-600 ml-6">
                                {c.text}
                              </li>
                            ))}
                          </>
                        );
                      })}
                    </ul>
                  </>
                );
              })}
            </div>
          ) : (
            columns.map((col, i) => {
              if (
                !["actions", "review"].includes(retro.step) &&
                col.id === "actions"
              ) {
                return null;
              }
              const cards = getCardsInColumn(col.id);
              if (
                retro.step !== "brainstorm" &&
                col.id !== "actions" &&
                cards.length === 0
              ) {
                return;
              }
              return (
                <div
                  className={
                    "flex-1 overflow-y-auto bg-white border shadow-lg rounded-md pb-6"
                  }
                >
                  <div>
                    {retro.step === "brainstorm" || col.id === "actions" ? (
                      <div
                        className={`mt-4 mb-4 mx-4 relative rounded-md border-2 pr-3 ${
                          focusedColumn === col.id ? "border-gray-400" : ""
                        }`}
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <col.icon
                            className={`h-5 w-5 ${
                              focusedColumn === col.id
                                ? "text-gray-500"
                                : "text-gray-400"
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          type="text"
                          className="outline-none py-3 block w-full pl-10 border-gray-300 rounded-md"
                          placeholder={col.name}
                          spellCheck={false}
                          onFocus={() => setFocusedColumn(col.id)}
                          onBlur={() => setFocusedColumn(null)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (() => {
                              if (e.target.value.trim() === "") return;
                              e.preventDefault();
                              addEvent({
                                type: "add-card",
                                userID: clientID,
                                cardID: uuid(),
                                text: e.target.value,
                                parentCardID: col.id,
                              });
                              e.target.value = "";
                            })()
                          }
                        />
                      </div>
                    ) : (
                      <div className="mt-3 mb-2 text-center flex items-center justify-center h-16 flex-col">
                        <h1
                          className="text-gray-700 font-medium capitalize text-xl"
                          style={{ userSelect: "none" }}
                        >
                          {col.title}
                        </h1>
                      </div>
                    )}
                    <div className={`border-t border-gray-200`}>
                      {cards.map((card) => (
                        <Card
                          setHighlightedCardID={setHighlightedCardID}
                          getCardByID={(id) => retro.cards[id]}
                          highlighted={highlightedCardID === card.id}
                          card={card}
                          step={retro.step}
                          clientID={clientID}
                          colID={col.id}
                          addEvent={addEvent}
                          childCards={retro
                            .getCards()
                            .filter((e) => e.parentCardID === card.id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default RetroPage;
