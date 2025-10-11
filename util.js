function normalizeUrls(url,base){

    let tempUrl;
    try {
        tempUrl=base ? new URL(url,base):new URL(url);
    } catch (error) {
        throw new Error("Invalid URL provided");
    }
const hostname=tempUrl.hostname.toLocaleLowerCase();
const pathname=tempUrl.pathname=="/"?"":tempUrl.pathname;

return hostname+ pathname;
}


module.exports=normalizeUrls;