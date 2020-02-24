// routes.js
const Apify = require('apify');
const extractors = require('./extractors');

const {
    utils: { log },
} = Apify;


// BROWSE page crawler.
// Fetches the ebooks from the list
exports.BROWSE = async ({ $, request }, { requestQueue }) => {
    log.info(`CRAWLER -- Fetching products from the url: ${request.url}`);


    // Check for error
    if ($('html').html().includes('There are too many')) {
        log.error(`There too many books on website. It doesn't show up: ${request.url}`);
        process.exit(0);
    }

    // Fetch all current ebooks listed
    const ebooks = extractors.fetchEbooksFromBrowse($);

    // Add them to request queue
    for (const ebook of ebooks) {
        await requestQueue.addRequest(
            {
                url: ebook,
                userData: {
                    label: 'EBOOK',
                },
            },
            { forefront: true },
        );
    }

    log.debug(`CRAWLER -- ${ebooks.length} ebooks added to queue`);
};

// SEARCH page crawler.
// Fetches the ebooks from search page and
// Adds next page to request queue
exports.SEARCH = async ({ $, request }, { requestQueue }) => {
    const { page, baseURL } = request.userData;
    log.info(`CRAWLER -- Fetching products from the url: ${request.url} page: ${page}`);

    // Fetch all current ebooks listed
    const ebooks = extractors.fetchEbooksFromSearch($);

    // Add them to request queue
    for (const ebook of ebooks) {
        await requestQueue.addRequest(
            {
                url: ebook,
                userData: {
                    label: 'EBOOK',
                },
            },
            { forefront: true },
        );
    }

    // Move to next page
    if (ebooks.length > 0) {
        await requestQueue.addRequest({
            url: `${baseURL}&start_index=${25 * page + 1}`,
            userData: {
                label: 'SEARCH',
                page: page + 1,
                baseURL,
            },
        });
    }

    log.debug(`CRAWLER -- ${ebooks.length} ebooks added to queue`);
};

// EBOOK page crawler.
// Gets details of current ebook
exports.EBOOK = async ({ $, request }) => {
    const { maxItems, extendOutputFunction } = global.userInput;
    log.info(`CRAWLER -- Fetching ebook details from ${request.url}`);

    // Fetch ebook details
    const ebook = extractors.fetchEbook($);

    // Push data
    await Apify.pushData({ ...ebook, ...(extendOutputFunction ? { ...eval(extendOutputFunction)($) } : {}) });

    log.debug(`CRAWLER -- ebook details fetched from ${request.url}`);

    // Check for maxItems
    if (maxItems) {
        const dataset = await Apify.openDataset();
        const { cleanItemCount } = await dataset.getInfo();

        if (maxItems <= cleanItemCount) {
            process.exit(0);
        }
    }
};
