const { parse } = require("node-html-parser");
const axios = require("axios");
const utility = require("../Utility/utility");

var services = {

  async getHrefPage(urlPagination, url) {
    //console.log("urlPagination", urlPagination);

    let res = await axios.get(urlPagination);
    let data = res.data;

    if (res.status === 200) {
      let content = parse(data);
      let hrefPageOdd = [];

      let hrefPage = content
        .querySelectorAll("li .releaseBlock .releaseBlockImg a")
        .map((item) => ({
          href: item.getAttribute("href"),
        }));

        //console.log("hrefPage", hrefPage);

      return hrefPage;
    }
  },

  async getContentPage(urlPageContent, url) {
    //console.log("urlPagination", urlPageContent);

    let res = await axios.get(urlPageContent);
    let data = res.data;

    if (res.status === 200) {
      let vinyl = new Object;
      let content = parse(data)

      let image = content
        .querySelector(".columna .artwork a img")
        .getAttribute("data-lazy-src").toString();

      let artist = "";
      let album = "";
      let label = "";
      let release = "";

      let info = content
        .querySelectorAll(".columnb .releaseInfo dd")
        .map(
          (item, index) => {
            index == 0 ? (artist = item.innerHTML.toString()) : null;
            index == 1 ? (album = item.innerHTML.toString()) : null;
            index == 2 ? (label = item.querySelector("a").innerHTML.toString()) : null;
            index == 5
              ? (release = item
                  .querySelector("ul li")
                  .innerHTML.toString()
                  .replace(/<\/?span[^>]*>/g, "")
                  .replace("FIRST RELEASE ", ""))
              : null;
          }
        );

      let tracks = content
        .querySelectorAll(".sm2-playlist-wrapper .sm2-playlist-bd li a")
        .map((item) => ({
          name: item.innerHTML.toString().slice(4, 500),
          url: item.getAttribute("href").toString(),
        }));

      let description = content
        .querySelector(".columnb .releaseInfo .descriptionDD p")
        .innerHTML.toString();


      vinyl.image = image != "" || undefined || null ? image : null
       vinyl.artist = artist != "" || undefined || null ? artist : null
       vinyl.album = album != "" || undefined || null ? album : null
       vinyl.label = label != "" || undefined || null ? label : null
       vinyl.release = release != "" || undefined || null ? release : null
       vinyl.tracks = tracks != "" || undefined || null ? tracks : null
       vinyl.description = description != "" || undefined || null ? description : null

      return vinyl;
    }
  },
};

module.exports = services;






