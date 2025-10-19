const { normalizeUrls, extractURLsfromHTML } = require("../src/util.js");
describe("Testing normalization of URLS", () => {
    test("Remove protocol from url", () => {
        const url = "https://example.com";
        const res = normalizeUrls(url);
        expect(res).toEqual("example.com");
    })

    test("Remove trailing slash", () => {
        const url = "https://example.com/";
        const res = normalizeUrls(url);
        expect(res).toEqual("example.com");
    })

    test("test invalid urls", () => {
        let malformedUrl = "yudsdsjsdbujkujbv";
        expect(() => normalizeUrls(malformedUrl)).toThrow("Invalid URL provided");
    })


    test("Hostname is lowercased", () => {
        const url = "https://EXAMPLE.com/Path";
        const res = normalizeUrls(url);
        expect(res).toEqual("example.com/Path");
    });

    test("Remove query string", () => {
        const url = "https://example.com/path?search=test";
        const res = normalizeUrls(url);
        expect(res).toEqual("example.com/path");
    });


    test("Remove fragments", () => {
        const url = "https://example.com/path#section";
        const res = normalizeUrls(url);
        expect(res).toEqual("example.com/path");
    });

    test("Relative URL resolved with base", () => {
        const url = "/folder/page";
        const base = "https://example.com";
        const res = normalizeUrls(url, base);
        expect(res).toEqual("example.com/folder/page");
    });

    test("remove trailing slash even if not root", () => {
        const url = "https://example.com/folder/";
        const res = normalizeUrls(url);
        expect(res).toEqual("example.com/folder");
    });

    test("Throws error on invalid URL", () => {
        const url = "ht!tp://bad_url";
        expect(() => normalizeUrls(url)).toThrow("Invalid URL provided");
    });
});

describe("Testing extraction of urls", () => {

    test("extracts absolute URLs", () => {
        const html = `
            <a href="https://example.com">Example</a>
            <a href="http://test.com/page">Test</a>
        `;
        const result = extractURLsfromHTML(html);
        expect(result).toEqual([
            "example.com",
            "test.com/page"
        ]);
    });

    test("extracts relative URLs", () => {
        const html = `
            <a href="/about">About</a>
            <a href="contact.html">Contact</a>
        `;
        const result = extractURLsfromHTML(html, "https://example.com");
        expect(result).toEqual([
            "example.com/about",
            "example.com/contact.html"
        ]);
    });

    test("ignores <a> tags without href", () => {
        const html = `
            <a>No link</a>
            <a href="https://example.com">Valid</a>
        `;
        const result = extractURLsfromHTML(html);
        expect(result).toEqual(["example.com"]);
    });

    test("trims whitespace in href", () => {
        const html = `
            <a href=" https://site.com ">Site</a>
        `;
        const result = extractURLsfromHTML(html);
        expect(result).toEqual([
            "site.com"
        ]);
    });

    test("filters out empty href attributes", () => {
        const html = `
            <a href="">Empty</a>
            <a href="valid.html">Valid</a>
        `;
        const result = extractURLsfromHTML(html, "https://example.com/");
        expect(result).toEqual(["example.com/valid.html"]);
    });

    test("handles duplicate hrefs", () => {
        const html = `
            <a href="https://example.com">Example</a>
            <a href="https://example.com">Example</a>
        `;
        const result = extractURLsfromHTML(html);
        expect(result).toEqual([
            "example.com"
        ]);
    });

    test("returns empty array if no <a> tags", () => {
        const html = `<p>No links here</p>`;
        const result = extractURLsfromHTML(html);
        expect(result).toEqual([]);
    });

    test("filter by protocol", () => {
        const html = `
        
        <a href="https://example.com/ex" >ml</a>
         <a href="http://example.com/ex" >ex</a>
        <a href="mailto:ma@ex.com">mail</a>
        `
        const h = extractURLsfromHTML(html, undefined, "http:")
        const hs = extractURLsfromHTML(html, undefined, "https:")
        const m = extractURLsfromHTML(html, undefined, "mailto:")

        expect(h).toEqual(["example.com/ex"])
        expect(hs).toEqual(["example.com/ex"])
        expect(m).toEqual(["ma@ex.com"]);

    })

});
