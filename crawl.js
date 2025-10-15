import { normalizeUrls, extractURLsfromHTML } from "./util.js";
function crawl(currentUrl) {
    const curr = normalizeUrls(currentUrl);

}

async function crawlHelper(currentUrl, map = [{ url: "", in: 0, out: 0 }]) {
    const response = await fetch(currentUrl);
    if (response.status > 399) {
        console, log(`${currentUrl}  returned status ${response.status} skipping`);
        return;
    }
    if (response.headers.get("Content-Type").includes("text/html")) {
        const links = extractURLsfromHTML(await response.text(), new URL(currentUrl).hostname);
        map.find(obj => obj['url'] === currentUrl).out += links.length;

        const containsAll = () => {
            const urls = map.map(entry => entry.url);
            for (const link of links) {
                if (!urls.includes(link)) {
                    return false;
                }
            }
            return true;
        }
        if(containsAll()){
            console.log("Loop detected jumping out ...");
            return;
        }
        for (const link of links) {
            const found = map.find(obj => obj["url"] === link);
            if (found) {
                found["in"]++;
            } else {
                map.push({ url: link, in: 0, out: 0 })
            }
            await crawlHelper(link, map);
        }

    } else {
        console.log(`${currentUrl} didnt return any html skipping...`)
        return;
    }
}
export default crawl