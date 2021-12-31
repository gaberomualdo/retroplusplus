import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FolderRemoveIcon,
  XIcon,
} from "@heroicons/react/outline";
import { StarIcon } from "@heroicons/react/solid";
import React, { useState } from "react";
import seedrandom from "seedrandom";
import { columns } from "../lib/util";
function ChildCard({ card, moveOut, step }) {
  const [hovered, setHovered] = useState(false);
  const style = { marginLeft: "-1.25rem", userSelect: "none" };
  if (step !== "move") style.pointerEvents = "none";
  return (
    <button
      className="flex text-gray-400 items-center border-gray-300 border-l"
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        moveOut();
      }}
    >
      <FolderRemoveIcon
        className={`transition-all h-4 w-4 ml-0.5 mr-0.5 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      />
      <p className="text-sm">{card.text}</p>
    </button>
  );
}
export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      startPosition: [0, 0],
      startClickPosition: [0, 0],
      positionChange: [0, 0],
      dragging: false,
      startWidth: 0,
      draggingTransitionEnded: true,
    };
    this.ref = React.createRef();
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.getCardIDToMoveTo = this.getAndUpdateCardIDToMoveTo.bind(this);
  }
  componentDidMount() {
    document.addEventListener("mouseup", this.mouseUp);
    document.addEventListener("mousemove", this.mouseMove);
  }
  componentWillUnmount() {
    document.removeEventListener("mouseup", this.mouseUp);
    document.removeEventListener("mousemove", this.mouseMove);
  }
  getAndUpdateCardIDToMoveTo() {
    const cardRect = this.ref.current.getBoundingClientRect();
    const cardPosition = [
      this.state.startPosition[0] + this.state.positionChange[0],
      this.state.startPosition[1] + this.state.positionChange[1],
    ];
    let cardIDToMoveTo = null;
    Array.from(document.querySelectorAll("[data-card-id]")).forEach(
      (cardElm) => {
        const cardElmCardID = cardElm.getAttribute("data-card-id");
        const cardElmColID = cardElm.getAttribute("data-col-id");
        if (cardElmCardID === this.props.card.id) return;
        if (cardElmColID !== this.props.colID) return;
        const cardElmRect = cardElm.getBoundingClientRect();
        // TODO: prefer the card that has the most overlap with the card being dragged
        if (
          cardElmRect.left + cardElmRect.width >= cardPosition[0] &&
          cardElmRect.left <= cardPosition[0] + cardRect.width &&
          cardElmRect.top + cardElmRect.height >= cardPosition[1] &&
          cardElmRect.top <= cardPosition[1] + cardRect.height
        ) {
          // they are overlapping
          const overlappingRectWidth =
            Math.min(
              cardElmRect.left + cardElmRect.width,
              cardPosition[0] + cardRect.width
            ) - Math.max(cardElmRect.left, cardPosition[0]);
          const overlappingRectHeight =
            Math.min(
              cardElmRect.top + cardElmRect.height,
              cardPosition[1] + cardRect.height
            ) - Math.max(cardElmRect.top, cardPosition[1]);
          const overlappingRectArea =
            overlappingRectWidth * overlappingRectHeight;
          const cardElmArea = cardElmRect.width * cardElmRect.height;
          const overlapFraction = overlappingRectArea / cardElmArea;
          const overlapFractionThreshold = 0.4;
          if (overlapFraction > overlapFractionThreshold) {
            cardIDToMoveTo = cardElmCardID;
          }
        }
      }
    );
    this.props.setHighlightedCardID(cardIDToMoveTo);
    return cardIDToMoveTo;
  }
  mouseUp() {
    if (!this.state.dragging) return;
    setTimeout(() => {
      this.setState({ dragging: false });
    }, 0);
    setTimeout(() => {
      this.setState({ draggingTransitionEnded: true });
    }, 250);
    const cardIDToMoveTo = this.getAndUpdateCardIDToMoveTo();
    if (cardIDToMoveTo) {
      const cardToMoveTo = this.props.getCardByID(cardIDToMoveTo);
      if (columns.map((e) => e.id).includes(cardToMoveTo.parentCardID)) {
        this.props.addEvent(
          {
            type: "move-card",
            cardID: this.props.card.id,
            parentCardID: cardIDToMoveTo,
          },
          () => {
            this.props.setHighlightedCardID(null);
          }
        );
      }
    }
    this.props.setHighlightedCardID(null);
  }
  mouseMove(e) {
    if (this.state.dragging) {
      this.setState({
        positionChange: [
          e.clientX - this.state.startClickPosition[0],
          e.clientY - this.state.startClickPosition[1],
        ],
      });
      const cardIDToMoveTo = this.getAndUpdateCardIDToMoveTo();
      this.props.setHighlightedCardID(cardIDToMoveTo);
    }
  }
  render() {
    const { card, clientID, step, addEvent, colID } = this.props;
    const { hovered } = this.state;
    const isOwnCard = card.userID === clientID;
    const getCardRect = () => this.ref?.current?.getBoundingClientRect();
    const cardPaddingClassname =
      step === "brainstorm" || colID === "actions" ? "py-4" : "py-2";
    let rightSide = null;
    if (isOwnCard && (step === "brainstorm" || colID === "actions")) {
      rightSide = (
        <div className="flex justify-end" style={{ minWidth: "2.5rem" }}>
          {hovered ? (
            <button
              className={`transition-all bg-gray-200 rounded-full w-6 h-6 flex justify-center items-center text-gray-800 hover:text-white hover:bg-red-500`}
              onClick={() => {
                addEvent({
                  type: "remove-card",
                  cardID: card.id,
                });
              }}
            >
              <XIcon className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      );
    } else if (hovered && step === "actions" && colID !== "actions") {
      rightSide = (
        <div className={`flex`} style={{ minWidth: "4rem" }}>
          <button
            className={`transition-all rounded-full w-6 h-6 flex justify-center items-center ml-2 ${
              card.actioned
                ? "text-white bg-green-500"
                : "text-gray-800 bg-gray-200"
            }`}
            onClick={() => {
              addEvent({
                type: "action-card",
                cardID: card.id,
              });
            }}
          >
            <CheckIcon className="w-4 h-4" />
          </button>
          <button
            className={`transition-all rounded-full w-6 h-6 flex justify-center items-center ml-2 ${
              card.pinned
                ? "text-white bg-yellow-500"
                : "text-gray-800 bg-gray-200"
            }`}
            onClick={() => {
              addEvent({
                type: "pin-card",
                cardID: card.id,
              });
            }}
          >
            <StarIcon className="w-4 h-4" />
          </button>
        </div>
      );
    } else if (step !== "brainstorm" && colID !== "actions") {
      rightSide = (
        <div
          className={`text-sm text-gray-400 flex-initial flex justify-end items-center`}
          style={{ flexShrink: 0, minWidth: "4rem" }}
        >
          <div
            style={
              step === "move" ? {} : { pointerEvents: "none", opacity: ".5" }
            }
          >
            <ChevronUpIcon
              style={{
                transform: "scaleX(1.05)",
              }}
              onClick={() => {
                if (card.upvoters.includes(clientID)) {
                  addEvent({
                    type: "remove-vote-from-card",
                    cardID: card.id,
                    userID: clientID,
                  });
                } else {
                  addEvent({
                    type: "upvote-card",
                    cardID: card.id,
                    userID: clientID,
                  });
                }
              }}
              className={`w-6 h-6 cursor-pointer ${
                card.upvoters.includes(clientID)
                  ? "text-gray-800"
                  : "hover:text-gray-500"
              }`}
            />
            <ChevronDownIcon
              className={`w-6 h-6 cursor-pointer ${
                card.downvoters.includes(clientID)
                  ? "text-gray-800"
                  : "hover:text-gray-500"
              }`}
              onClick={() => {
                if (card.downvoters.includes(clientID)) {
                  addEvent({
                    type: "remove-vote-from-card",
                    cardID: card.id,
                    userID: clientID,
                  });
                } else {
                  addEvent({
                    type: "downvote-card",
                    cardID: card.id,
                    userID: clientID,
                  });
                }
              }}
              style={{ marginTop: "-0.5rem", transform: "scaleX(1.05)" }}
            />
          </div>
          <span
            className="mono text-base ml-1.5"
            style={{ userSelect: "none" }}
          >
            {card.upvoters.length - card.downvoters.length}
          </span>
        </div>
      );
    }
    let cardClassname = `px-4 flex items-center border-b cursor-default `;
    if (this.props.highlighted) {
      cardClassname += "bg-blue-100 border-t border-blue-100";
    } else if (card.pinned) {
      cardClassname += "bg-yellow-100 border-t border-yellow-100";
    } else {
      cardClassname += "bg-white border-gray-200";
    }

    const onMouseDown = (e) => {
      if (step !== "move") return;
      if (this.state.dragging) return;
      if (this.props.childCards.length > 0) return;
      this.setState({
        startPosition: [getCardRect().left, getCardRect().top],
        startClickPosition: [e.clientX, e.clientY],
        positionChange: [0, 0],
        startWidth: getCardRect().width,
        dragging: true,
        draggingTransitionEnded: false,
      });
    };
    if (this.state.dragging && step !== "move") {
      this.setState({ dragging: false, draggingTransitionEnded: true });
    }
    return (
      <>
        <div
          ref={this.ref}
          className={cardClassname + (this.state.dragging ? " rounded" : "")}
          data-card-id={card.id}
          data-col-id={colID}
          style={{
            transition: "background-color .25s",
            marginTop: this.props.highlighted || card.pinned ? "-1px" : "0",
            ...(this.state.dragging
              ? {
                  position: "fixed",
                  left: `${this.state.startPosition[0]}px`,
                  top: `${this.state.startPosition[1]}px`,
                  transform: `translate(${this.state.positionChange[0]}px, ${this.state.positionChange[1]}px)`,
                  zIndex: 1000,
                  boxShadow: "0px 3px 8px rgba(0,0,0,0.075)",
                  width: `${this.state.startWidth}px`,
                }
              : { transition: "background-color .25s, transform 0.25s" }),
          }}
          onMouseEnter={() => this.setState({ hovered: true })}
          onMouseLeave={() => this.setState({ hovered: false })}
        >
          <div
            className={`flex flex-1 items-center ${
              this.props.childCards.length > 0 ? "py-3" : cardPaddingClassname
            } ${step === "move" ? "cursor-move" : ""}`}
            onMouseDown={onMouseDown}
          >
            <span
              className="text-sm text-gray-400 w-9 flex-initial mono self-start pt-1.5"
              style={{ flexShrink: 0, userSelect: "none" }}
            >
              #{card.number}
            </span>
            <div className="flex-1" style={{ fontSize: 0, flexShrink: 1 }}>
              {step === "brainstorm" && !isOwnCard ? (
                (() => {
                  // generate skeleton
                  const res = [];
                  const rand = seedrandom(card.id);
                  const numWords = Math.floor(rand() * 4) + 3;
                  for (let i = 0; i < numWords; i++) {
                    const sizePx = Math.floor(rand() * 50) + 35;
                    res.push(
                      <div
                        className="rounded bg-gray-200 h-4 inline-block mr-1 my-0.5"
                        style={{ width: `${sizePx}px` }}
                      ></div>
                    );
                  }
                  return res;
                })()
              ) : (
                <div>
                  <p
                    className={`text-base text-gray-700 py-1 ${
                      card.actioned ? "line-through opacity-60" : ""
                    }`}
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      wordBreak: "break-all",
                    }}
                  >
                    {card.text}
                  </p>
                  {this.props.childCards.length > 0 ? (
                    <div className="my-1">
                      {this.props.childCards.map((childCard) => (
                        <ChildCard
                          card={childCard}
                          moveOut={() => {
                            addEvent({
                              type: "move-card",
                              cardID: childCard.id,
                              parentCardID: card.parentCardID,
                            });
                          }}
                          step={step}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
          <div
            className={
              "self-start flex items-center overflow-hidden " +
              cardPaddingClassname
            }
            style={{ minHeight: "4rem" }}
          >
            {rightSide}
          </div>
        </div>
        {this.state.dragging || !this.state.draggingTransitionEnded ? (
          <div
            className={cardClassname}
            style={{
              width: "100%",
              height: `${this.state.dragging ? getCardRect().height : 0}px`,
              display: "block",
            }}
          ></div>
        ) : null}
      </>
    );
  }
}
