const Apify = require('apify');
const routes = require('./routes');

const {
    utils: { log },
} = Apify;

// Retrieves sources and returns object for request list
exports.getSources = async () => {
    log.debug('Getting sources');

    // Get user input
    const { search, language, startUrls } = global.userInput;

    // Build start URLs
    if (language) {
        return [{
            url: `https://www.gutenberg.org/browse/languages/${language}`,
            userData: {
                label: 'BROWSE',
                baseURL: `https://www.gutenberg.org/browse/languages/${language}`,
            },
        }];
    }

    if (search) {
        return [{
            url: `https://www.gutenberg.org/ebooks/search/?query=${search.toLowerCase().replace(' ', '+')}`,
            userData: {
                label: 'SEARCH',
                page: 1,
                baseURL: `https://www.gutenberg.org/ebooks/search/?query=${search.toLowerCase().replace(' ', '+')}`,
            },
        }];
    }

    if (startUrls && startUrls.length > 0) {
        return startUrls.map((startUrl) => {
            let label = '';
            let page = null;

            // Check route dependent on url
            if (startUrl.url.match(/\/ebooks\/[0-9]/g)) {
                label = 'EBOOK';
            }

            if (startUrl.url.match(/\/browse\//g)) {
                label = 'BROWSE';
                page = 1;
            }

            if (startUrl.url.match(/ebooks\/search/g)) {
                label = 'SEARCH';
                page = 1;
            }

            return {
                url: startUrl.url,
                userData: {
                    label,
                    ...(page ? { page } : {}),
                },
            };
        });
    }
};

// Create router
exports.createRouter = (globalContext) => {
    return async function (routeName, requestContext) {
        const route = routes[routeName];
        if (!route) throw new Error(`No route for name: ${routeName}`);
        log.debug(`Invoking route: ${routeName}`);
        return route(requestContext, globalContext);
    };
};
