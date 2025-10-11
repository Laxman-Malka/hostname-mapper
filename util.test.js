const normalizeUrls =require( "./util");

test("Remove protocol from url",()=>{
const url="https://example.com";
const res=normalizeUrls(url);
expect(res).toEqual("example.com");
})

test("Remove trailing slash",()=>{
    const url="https://example.com/";
const res=normalizeUrls(url);
expect(res).toEqual("example.com");
})

test("test malformed urls",()=>{
    let malformedUrl="yudsdsjsdbujkujbv";
    try {
        normalizeUrls(malformedUrl," ")
    } catch (error) {
        expect(error.message).toEqual("Invalid URL provided");
    }
})