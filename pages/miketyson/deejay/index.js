const services = require("./services");

const url = "https://www.deejay.de";
const urlParameter ="/content.php?param=/m_All/sm_Charts/liste_buzz/page_17/perpage_20/page_";
const fs = require("fs");

var miketyson = {

  async getPage(pagination) {
    if (pagination) {
      for (let i = 1; i <= pagination; i++) {
        this.getHrefPages(url + urlParameter + i, url);
      }
    } else {
      // da capire come tirare fuori l'ultima pagina dal sito

      // await services.getLastPage(url + urlParameter + "0").then((res) => {
      //   res.map((e) => {
      //     let pagination = e;
      //     for (let i = 0; i <= pagination; i++) {
      //       this.getHrefPages(url + urlParameter + i, url);
      //     }
      //   });
      // });
    }
  },

  async getHrefPages(urlPagination, url) {
    await services.getHrefPage(urlPagination, url).then((res) => {
      res.map((e) => {
          //console.log(e[0].href)
          this.getContentHrefPages(e[0].href, url);
      });
    });
  },

  async getContentHrefPages(urlPageContent, url) {
    response = []
    await services.getContentPage(urlPageContent, url).then((res) => {
      //console.log("Response: ", res);
      response.push(res);
    });
    console.log("deejay.de: ", response.length);

    let json = JSON.stringify(response, null, 2);

    fs.writeFile("./data/deejay.json", json, (err) => {
      if (err) throw err;
      console.log("Data written to file");
    });
  },
};

module.exports = miketyson;

