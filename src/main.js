const { crawl } = require("./crawl.js");
const { normalizeUrls } = require("./util.js");
const fs = require("fs");
async function main() {
    if (process.argv.length < 3) {
        console.error("No URL to crawl specified! Pass in a URL to crawl.");
        process.exit(1);
    }

    if (process.argv.length > 3) {
        console.error("Too many arguments! Specify only one URL to crawl.");
        process.exit(1);
    }

    try {
        let urlStr = process.argv[2].trim();
        urlStr = urlStr.replace(/['"]/g, '');

        const url = new URL(urlStr);
        let map;
        try {
            map = await crawl(normalizeUrls(url.href), url.protocol,url.hostname);
        } catch (err) {
            console.log("Error while crawling ",err);
        }finally{
                        console.log("Writing file");
            fs.writeFileSync("Crawl.json", JSON.stringify(Object.fromEntries(map), null, 4), (err) => {
                console.err("Failed to write file", err);
            })
        }
    } catch (err) {
        console.log(err);
        console.error(`${process.argv[2]} is in an invalid URL format. Exiting..`);
        process.exit(1);
    }
}

main().catch((e) => console.log("Crawl failed", e));