import {
  ChevronDownIcon,
  ChevronUpIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline";
import React, { Component } from "react";
import { formatNum } from "../lib/util";

const getCurrentTime = (endTime) => {
  if (endTime) {
    const nowMilliseconds = Date.now();
    return Math.max(0, endTime - nowMilliseconds);
  }
  return 0;
};

export default class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // times in milliseconds
      currentTime: getCurrentTime(this.props.endTime),
      selectTime: 0,
      open: true,
      updateCurrentTimeInterval: null,
    };
    this.updateCurrentTimeInterval = setInterval(() => {
      if (this.props.endTime) {
        this.setState({
          currentTime: getCurrentTime(this.props.endTime),
        });
      } else {
        if (this.state.currentTime !== 0) {
          this.setState({ currentTime: 0 });
        }
      }
    }, 250);
  }
  componentWillUnmount() {
    clearInterval(this.updateCurrentTimeInterval);
  }
  render() {
    const timeSeconds =
      (this.props.endTime
        ? getCurrentTime(this.props.endTime)
        : this.state.selectTime) / 1000;
    const displayTimeMinutes = formatNum(Math.floor(timeSeconds / 60));
    const displayTimeSeconds = formatNum(Math.floor(timeSeconds % 60));
    return (
      <div
        className="duration-300 fixed shadow-lg hidden md:block bg-white right-5 border border-gray-200 transition-all rounded-t-md"
        style={{
          top: "100%",
          transform: `translateY(${this.state.open ? "-100%" : "-2.5rem"})`,
        }}
      >
        <div
          className="flex justify-between items-center"
          style={{
            height: "2.5rem",
          }}
        >
          <p className="text-md md:text-lg text-gray-700 font-semibold ml-3">
            Timer
          </p>
          <button
            className="text-gray-500 hover:text-gray-700 transition-all"
            onClick={() => this.setState({ open: !this.state.open })}
          >
            {this.state.open ? (
              <ChevronDownIcon className="w-6 h-6 mr-3" />
            ) : (
              <ChevronUpIcon className="w-6 h-6 mr-3" />
            )}
          </button>
        </div>
        <div className="pt-2 pb-3 px-3">
          <div className="roboto-mono text-center text-lg md:text-2xl font-semibold flex justify-center items-center">
            {this.props.endTime ? null : (
              <button
                className="text-gray-500 mr-2"
                onClick={() =>
                  this.setState({
                    selectTime: Math.max(0, this.state.selectTime - 60 * 1000),
                  })
                }
              >
                <MinusCircleIcon className="w-5 h-5" />
              </button>
            )}
            <span
              className={
                this.props.endTime !== null && timeSeconds === 0
                  ? "text-red-600"
                  : ""
              }
            >
              {displayTimeMinutes}:{displayTimeSeconds}
            </span>
            {this.props.endTime ? null : (
              <button
                className="text-gray-500 ml-2"
                onClick={() =>
                  this.setState({
                    selectTime: this.state.selectTime + 60 * 1000,
                  })
                }
              >
                <PlusCircleIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex justify-center items-center mt-6">
            <button
              onClick={() => {
                if (this.props.endTime) {
                  // end timer
                  this.props.addEvent({
                    type: "timer-ended",
                  });
                } else {
                  // start timer
                  this.props.addEvent({
                    type: "timer-started",
                    unixEndTime: Date.now() + this.state.selectTime,
                  });
                }
              }}
              type="button"
              className="transition-all inline-flex items-center px-3 py-2 border border-transparent text-sm rounded text-white bg-purple-600 hover:bg-purple-700 outline-none"
            >
              {this.props.endTime ? "New Timer" : "Start Timer"}
            </button>
            <button
              onClick={() => this.setState({ open: !this.state.open })}
              type="button"
              className="ml-2 transition-all inline-flex items-center px-3 py-2 border border-transparent text-sm rounded text-purple-800 bg-purple-200 hover:bg-purple-300 outline-none"
            >
              Close Timer
            </button>
          </div>
        </div>
      </div>
    );
  }
}
