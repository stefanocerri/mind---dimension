const { parse } = require("node-html-parser");
const axios = require("axios");
const utility = require("../Utility/utility");
const fs = require("fs");

var services = {

  async getLastPage(url) {

    let res = await axios.get(url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    let data = res.data;

    if (res.status === 200) {
      let contentPage = [];
      let content = parse(data);

      let last = content
        .querySelector(".pager-last.last a")
        .getAttribute("href")
        .slice(29, 30);

      contentPage.push(last);

      return contentPage;
    }
  },

  async getHrefPage(urlPagination, url) {
    //console.log("urlPagination", urlPagination);

    let res = await axios.get(urlPagination, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    let data = res.data;

    if (res.status === 200) {
      let content = parse(data);

      let hrefPage = content
        .querySelectorAll(".field-field-cover-image .field-item a")
        .map((item) => ({
          href: url + item.getAttribute("href"),
        }));

      return hrefPage;
    }
  },

  async getContentPage(urlPageContent, url) {
    //console.log("urlPagination", urlPageContent);
    var vinyl = new Object;
    let res = await axios.get(urlPageContent, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    let data = res.data;

    if (res.status === 200) {
      let content = parse(data);

      let image =
        url +
        content
          .querySelector(".field-field-product-images img")
          .getAttribute("src");
      let artist = content
        .querySelector(".field-name-field-artist .field-item")
        .innerHTML.toString();
      let album = content.querySelector(".produkttitle").innerHTML.toString();
      let label = content
        .querySelector(".field-name-field-label .field-item")
        .innerHTML.toString();
      let release = content
        .querySelector(".date-display-single")
        .innerHTML.toString();
      let tracks = content
        .querySelectorAll(".file a")
        .map((item) => ({
          name: item.innerHTML.toString(),
          url: item.getAttribute("href").toString(),
        }));

      let description = content
        .querySelector("#description .field-field-product-description p")
        .innerHTML.toString();

       vinyl.image = image != "" || undefined || null ? image : null
       vinyl.artist = artist != "" || undefined || null ? utility.cleanString(artist) : null
       vinyl.album = album != "" || undefined || null ? utility.cleanString(album) : null
       vinyl.label = label != "" || undefined || null ? label : null
       vinyl.release = release != "" || undefined || null ? release : null
       vinyl.tracks = tracks != "" || undefined || null ? tracks : null
       vinyl.description = description != "" || undefined || null ? description : null
       vinyl.resources = "Muting The Noise"

      //console.log("vinyl",vinyl, )

      return vinyl
    }
  },
};

module.exports = services;






