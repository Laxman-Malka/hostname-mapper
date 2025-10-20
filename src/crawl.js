const { link } = require("fs");
const { extractURLsfromHTML } = require("./util.js");
const readline = require("readline")

let isTerminated = false;

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
        console.log("\nTerminating crawl on user request...");
        isTerminated = true;
        process.stdin.setRawMode(false);
        process.stdin.pause();
    }
});


async function crawl(currentUrl, protocol, hostname,sitemap = new Map()) {
    const queue = [];
    sitemap.set(currentUrl,{in:0,out:0});
    queue.push(currentUrl);

    while (queue.length > 0) {

        if (isTerminated) {
            for (const link of queue) {
                sitemap.delete(link);
            }
            break;
        }

        const curr = queue.shift();
        const fullUrl = protocol + "//" + curr;
        let response;
        try {

            response = await fetch(fullUrl);
        } catch (err) {
            console.log(`Fetch failed for ${fullUrl} \n error name ${err.name} reason ${err.message} continuing`);
            continue;
        }
        console.log(`${fullUrl} : ${response.status} ${response.statusText}`);

        if (response.status > 399) {
            console.log(`${fullUrl}  returned status ${response.status} skipping`);
            if (response.status == 401 || response.status == 403) {
                console.log("Authentication or Authorisation headers required!");
            }
            continue;
        }

        if (response.headers.get("Content-Type").includes("text/html")) {
            const links = extractURLsfromHTML(await response.text(), fullUrl, protocol,hostname,true);
            sitemap.get(curr).out += links.length;
            for (const link of (links ?? [])) {
                if (sitemap.has(link)) {
                    sitemap.get(link).in++;
                } else {
                    sitemap.set(link, { in: 1, out: 0 });
                    queue.push(link);
                }
            }
        } else {
            console.log(`${fullUrl} didnt return any html skipping...`)
            continue;
        }

    }
    return sitemap;
}
module.exports = { crawl }