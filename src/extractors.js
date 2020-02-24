// Fetch offers from browse list page
const fetchEbooksFromBrowse = ($) => {
    return $('ul li a[href]')
        .filter((i, el) => $(el).attr('href').match(/ebooks\/[0-9]/g))
        .map((i, el) => `https://www.gutenberg.org${$(el).attr('href')}`)
        .get();
};

// Fetch offers from search list page
const fetchEbooksFromSearch = ($) => {
    return $('.booklink a[href]')
        .filter((i, el) => $(el).attr('href').match(/ebooks\/[0-9]/g))
        .map((i, el) => `https://www.gutenberg.org${$(el).attr('href')}`)
        .get();
};

// Fetch ebook defaults
const fetchEbook = $ => ({
    author: $('a[itemprop="creator"]').text().trim(),
    title: $('h1[itemprop="name"]').text().trim(),
    language: $('tr[itemprop="inLanguage"]').text().trim().replace(/Language/, '')
        .trim(),
    htmlURL: $('.files td[property="dcterms:format"]')
        ? `https://www.gutenberg.org${$('.files td[property="dcterms:format"]')
            .filter((i, el) => $(el).attr('content').includes('text/html'))
            .find('a')
            .attr('href')}` : null,
    epubURL: $('.files td[content="application/epub+zip"] a').attr('href')
        ? `https://www.gutenberg.org${$('.files td[content="application/epub+zip"] a').attr('href')}`
        : null,
    kindleURL: $('.files td[content="application/x-mobipocket-ebook"] a').attr('href')
        ? `https://www.gutenberg.org${$('.files td[content="application/x-mobipocket-ebook"] a').attr('href')}`
        : null,
    plainTextURL: $('.files td[content="text/plain; charset=utf-8"] a').attr('href')
        ? `https://www.gutenberg.org${$('.files td[content="text/plain; charset=utf-8"] a').attr('href')}`
        : null,
});

module.exports = {
    fetchEbooksFromBrowse,
    fetchEbooksFromSearch,
    fetchEbook,
};
