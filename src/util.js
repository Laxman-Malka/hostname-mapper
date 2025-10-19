const { JSDOM } = require('jsdom');
function normalizeUrls(url, base) {

    let tempUrl;
    try {
        tempUrl = base ? new URL(url, base) : new URL(url);
    } catch (error) {
        throw new Error("Invalid URL provided");
    }
    const hostname = tempUrl.hostname.toLowerCase();
    let pathname = tempUrl.pathname == "/" ? "" : tempUrl.pathname;

    if (pathname.endsWith("/")) {
        pathname = pathname.slice(0, -1);
    }


    return hostname + pathname;
}


function extractURLsfromHTML(htmlBody, baseUrl, outProtocol) {
    const dom = new JSDOM(htmlBody);
    const anchorList = dom.window.document.querySelectorAll("a");

    const linkSet = new Set();

    for (const a of anchorList) {
        let href = a.getAttribute("href")?.trim();
        if (!href) continue;

        try {
            const resolvedUrl = new URL(href, baseUrl);

            if (outProtocol && resolvedUrl.protocol !== outProtocol) {
                continue;
            }else if(!outProtocol){
                if (resolvedUrl.protocol !== 'http:' && resolvedUrl.protocol !== 'https:') {
                    continue;
                }
            }
            const normalizedUrl = normalizeUrls(resolvedUrl.href, baseUrl);
            linkSet.add(normalizedUrl);

        } catch (error) {
            console.log("Skipping invalid or malformed URL:", href);
            continue;
        }
    }
    return Array.from(linkSet);
}

module.exports = { normalizeUrls, extractURLsfromHTML }