const { parse } = require("node-html-parser");
const axios = require("axios");
const utility = require("../Utility/utility");

var services = {

  async getHrefPage(urlPagination, url) {
    //console.log("urlPagination", urlPagination);

    let res = await axios.get(urlPagination, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json",
      },
    });
    let data = res.data;

    if (res.status === 200) {
      let content = parse(data);
      let hrefPageOdd = [];

      let hrefPage = content
        .querySelectorAll(".notangemeldet .cover .img1 a")
        .map((item) => ({
            href: url + '/content.php?param=' + item.getAttribute("href").slice(1),
        }));

        for (var i = 0; i < hrefPage.length; i++) {
          hrefPageOdd.push(hrefPage.splice(i + 1, 1));
        }

      return hrefPageOdd;
    }
  },

  async getContentPage(urlPageContent, url) {
    //console.log("urlPagination", urlPageContent);

    let res = await axios.get(urlPageContent, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json",
      },
    });
    let data = res.data;

    if (res.status === 200) {
      let vinyl = new Object;
      let content = parse(data)

      let image = url + content.querySelector(".cover .noMod img").getAttribute("src").replace("l2", "xl")
      let artist = content
        .querySelector(".artikel .artist h1")
        .innerHTML.toString()
      let album = content.querySelector(".artikel .label h1").innerHTML.toString()
      let label = content
        .querySelector(".artikel .label h3")
        .innerHTML.toString()
      let release = utility.removeTags(content
        .querySelector(".date")
        .innerHTML.toString()).slice(10)

      let tracks = getTracks()

      function getTracks() {

        let trackFolder = image
          .replace("https://www.deejay.de/images/xl/", "")
          .split(".")
          .slice(0, -1)
          .join(".");

        let tracksEP = content
          .querySelectorAll(".playtrack a h5")
          .map((item, i) => ({
            name: item.innerHTML.toString(),
            url: "https://www.deejay.de/streamit/" + trackFolder + (i + 10).toString(36) + ".mp3",
          }));

        return tracksEP
      }

      let description = content
        .querySelector("#content .description p")
        .innerHTML.toString();

       vinyl.image = image != "" || undefined || null ? image : null
       vinyl.artist = artist != "" || undefined || null ? utility.cleanString(artist) : null
       vinyl.album = album != "" || undefined || null ? utility.cleanString(album) : null
       vinyl.label = label != "" || undefined || null ? label : null
       vinyl.release = release != "" || undefined || null ? release : null
       vinyl.tracks = tracks != "" || undefined || null ? tracks : null
       vinyl.description = description != "" || undefined || null ? description : null
       vinyl.resources = "Deejay.de"

      return vinyl;
    }
  },
};

module.exports = services;






