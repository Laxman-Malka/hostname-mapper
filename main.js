import crawl from "./crawl.js";
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
    crawl(url.href);
} catch (err) {
    console.error(`${process.argv[2]} is in an invalid URL format. Exiting..`);
    process.exit(1);
}
