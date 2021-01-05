var utilty = {

  removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, "");
  },

  cleanString(str) {
     return str
       .replace(/&nbsp;/g, " ")
       .replace(/&amp;/g, "&")
       .replace(/\s+/g, "")
  }

};

module.exports = utilty;
