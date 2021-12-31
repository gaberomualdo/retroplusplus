import { steps } from "./util";

export default class Retro {
  // string
  step = steps[0].id;
  // string[]
  users = [];
  // { text: string, userID: string, position: string, parentCardID?: string }
  cards = {};
  constructor(events) {
    events.forEach((e) => {
      switch (e.type) {
        case "user-joined":
          if (!this.users.includes(e.clientID)) {
            this.users.push(e.clientID);
          }
          break;
        case "add-card":
          this.cards[e.cardID] = {
            text: e.text,
            userID: e.userID,
            parentCardID: e.parentCardID || null,
            number: Math.max(0, ...this.getCards().map((e) => e.number)) + 1,
            downvoters: [],
            upvoters: [e.userID],
            actioned: false,
            pinned: false,
          };
          break;
        case "move-card":
          if (!this.cards[e.cardID]) return;
          this.cards[e.cardID].parentCardID = e.parentCardID || null;
          break;
        case "remove-card":
          if (!this.cards[e.cardID]) return;
          delete this.cards[e.cardID];
          break;
        case "action-card":
          if (!this.cards[e.cardID]) return;
          this.cards[e.cardID].actioned = !this.cards[e.cardID].actioned;
          break;
        case "pin-card":
          if (!this.cards[e.cardID]) return;
          this.cards[e.cardID].pinned = !this.cards[e.cardID].pinned;
          break;
        case "upvote-card":
          if (!this.cards[e.cardID]) return;
          if (this.cards[e.cardID].upvoters.includes(e.userID)) return;
          this.cards[e.cardID].downvoters = this.cards[
            e.cardID
          ].downvoters.filter((c) => c !== e.userID);
          this.cards[e.cardID].upvoters.push(e.userID);
          break;
        case "downvote-card":
          if (!this.cards[e.cardID]) return;
          if (this.cards[e.cardID].downvoters.includes(e.userID)) return;
          this.cards[e.cardID].upvoters = this.cards[e.cardID].upvoters.filter(
            (c) => c !== e.userID
          );
          this.cards[e.cardID].downvoters.push(e.userID);
          break;
        case "remove-vote-from-card":
          if (!this.cards[e.cardID]) return;
          if (this.cards[e.cardID].downvoters.includes(e.userID)) {
            this.cards[e.cardID].downvoters = this.cards[
              e.cardID
            ].downvoters.filter((c) => c !== e.userID);
          } else if (this.cards[e.cardID].upvoters.includes(e.userID)) {
            this.cards[e.cardID].upvoters = this.cards[
              e.cardID
            ].upvoters.filter((c) => c !== e.userID);
          }
          break;
        case "set-step":
          this.step = e.step;
          break;
        default:
          break;
      }
    });
  }
  getCards() {
    return Object.keys(this.cards).map((e) => ({ ...this.cards[e], id: e }));
  }
}
