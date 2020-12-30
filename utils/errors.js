module.exports = {
  create(options) { //msg, status, code, 
    const opts = options;
    if (typeof options === "string") {
      opts = {
        msg: options
      };
    }
    const ERR = new Error(opts.msg || "Error occured");
    if (opts.status) {
      ERR.status = opts.status;
    }
    return ERR;
  }
};