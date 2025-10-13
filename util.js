import {JSDOM} from 'jsdom';
export function normalizeUrls(url, base) {

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


export function extractURLsfromHTML(htmlBody) {
    const dom = new JSDOM(htmlBody);
    const anchorList = dom.window.document.querySelectorAll("a");
    const links = Array.from(anchorList,a=>a.getAttribute("href")?.trim());
    return links.filter(Boolean);
}