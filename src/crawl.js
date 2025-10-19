const { normalizeUrls, extractURLsfromHTML } = require("./util.js");
async function crawl(currentUrl,protocol) {
    const curr = normalizeUrls(currentUrl);
    const map=new Map();
    await crawlHelper(curr,map,protocol);
    return map;
}

async function crawlHelper(currentUrl, map=new Map(),protocol) {
    if(map.has(currentUrl))
         return;
    const full=protocol+"//"+currentUrl;
    const response = await fetch(full);
    if (response.status > 399) {
        console.log(`${currentUrl}  returned status ${response.status} skipping`);
        if(response.status == 401 || response.status == 403){
            console.log("Authentication or Authorisation headers required!");
            console.log(`Server says ${await response.text()}`)
        }
        return;
    }
    if (response.headers.get("Content-Type").includes("text/html")) {
        const links = extractURLsfromHTML(await response.text(), full,protocol);
        map.set(currentUrl,{in:0,out:links.length});
        for (const link of links) {
            const found = map.has(link);
            if (found) {
                map.get(link).in++
            } else {
                map.set(link,{ in: 1, out: 0 })
            }
            await crawlHelper(link, map,protocol);
        }
    } else {
        console.log(`${full} didnt return any html skipping...`)
        return;
    }
}
module.exports={ crawl}