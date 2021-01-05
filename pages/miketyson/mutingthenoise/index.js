const services = require("./services");

const url = "https://www.mutingthenoise.com";
const urlParameter = "/front-slider-2/owlajax?page=";
const fs = require("fs");

var miketyson = {

  async getPage(pagination) {
    if (pagination) {
      for (let i = 1; i <= pagination; i++) {
        this.getHrefPages(url + urlParameter + i, url);
      }
    } else {
      await services.getLastPage(url + urlParameter + "0").then((res) => {
        res.map((e) => {
          let pagination = e;
          for (let i = 0; i <= pagination; i++) {
            this.getHrefPages(url + urlParameter + i, url);
          }
        });
      });
    }
  },

  async getHrefPages(urlPagination, url) {
    await services.getHrefPage(urlPagination, url).then((res) => {
      res.map((e) => {
        this.getContentHrefPages(e.href, url);
      });
    });
  },

  async getContentHrefPages(urlPageContent, url) {
    response = [];
    await services.getContentPage(urlPageContent, url).then((res) => {
      //console.log("Response: ", res);
      response.push(res);
    });
    console.log("mutingthenoise.com: ", response.length);

    let json = JSON.stringify(response, null, 2);

    fs.writeFile("./data/mutingthenoise.json", json, (err) => {
      if (err) throw err;
      console.log("Data written to file");
    });
  },
};

module.exports = miketyson;

