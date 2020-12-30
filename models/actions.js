const {log, info, dir, table, error} = console;

const path = require("path");
process.env.PROJ_PATH = process.env.PROJ_PATH || path.resolve("../");
const ENV = require("../utils/env_");

class Actions extends Object {

  constructor(Model) {
    if (Actions.executed) {
      super(Model);
    } else {
      Actions.executed = true;
      super(Model);
      this.model = Model;
      Object.defineProperty(this, "collection", {
        enumerable: false,
        writable: true,
        configurable: true,
        value: {
          get lastStop() {
            return ENV.start;
          },
          set lastStop(val) {
            ENV.start = val;
          },
          list: this,

          loop(span) {
            if (this.lastStop > this.list.length) {
              return null;
            }
            let start = this.lastStop;
            this.lastStop = +this.lastStop + +span;
            const list = [];
            for (const ind of Array(span)) {
              if (this.list[start] == undefined) {
                break;
              }
              list.push(this.list[start++]);
            }
            return list;
          }
        }
      });
    }
  }

  getByCountOf(span) {

    return this.collection.loop(span);
  }


  getBySpan(span) {

    return this.collection.loop(span);

  }

  get lastTen() {
    return this.last(10);
  }

  get firstTen() {
    return this.first(10);
  }

  async first(x) {
    // return this.slice(0, x);
    const data = await this.model.find({}, null, {
      limit: x
    }).exec();
    return this.prune(data);
  }

  async last(x) {
    const data = await this.model.find({}, null, {
      limit: x,
      sort: {
        "id": "-1"
      }
    }).exec();
    return this.prune(data);
  }

  prune(dataArray) {
    if (!Array.isArray(dataArray)) {
      dataArray = [dataArray];
    }
    const unwanted = ["uploads", "_id", "__v", "date_created", "date_updated"];
    dataArray = dataArray.map(data => {
      for (const prop of unwanted) {
        data[prop] = undefined;
      }
      return data;
    });
    return dataArray;
  }

}

module.exports = Actions;