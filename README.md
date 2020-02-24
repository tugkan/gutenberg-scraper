# Actor - Gutenberg.org Scraper

Gutenberg.org Scraper is an [Apify actor](https://apify.com/actors) for extracting data of ebooks from [Gutenberg.org](https://gutenberg.org). It allows you to search for keywords and pick a language. It is build on top of [Apify SDK](https://sdk.apify.com/) and you can run it both on [Apify platform](https://my.apify.com) and locally.

- [Gutenberg.org Scraper Input Parameters](#input-parameters)
- [Gutenberg.org Scraper Input Example](#input-example)
- [Gutenberg.org Scraper Ebook Output](#output)
- [Extend output function](#extend-output-function)
- [Compute Unit Consumption](#compute-unit-consumption)
- [During The Run](#during-the-run)
- [Gutenberg.org Export](#export)


## Gutenberg.org Scraper Input Parameters

The input of this scraper should be JSON containing the list of pages on Gutenberg that should be visited. Required fields are:

| Field | Type | Description |
| ----- | ---- | ----------- |
| search | String | (optional)  | The keyword that you want to search on Gutenberg |
| language | Array | (optional) List of languages that Gutenberg provides. You can fetch all ebooks of a language with it |
| startUrls | Array | (optional) List of Gutenberg URLs. You should provide ony "search" or "browse" URLs |
| maxItems | Integer | (optional) Maximum number of items that output will contain |
| extendOutputFunction | string | Function that takes a JQuery handle ($) as argument and returns data that will be merged with the default output. More information in [Extend output function](#extend-output-function) |
| proxyConfig | Object | Proxy configuration |

This solution requires the use of **Proxy servers**, either your own proxy servers or you can use <a href="https://www.apify.com/docs/proxy">Apify Proxy</a>.


### Gutenberg Scraper Input example
```json
{
	"proxyConfig":{"useApifyProxy": true},
	"startUrls":   [
		{ "url": "https://www.gutenberg.org/browse/recent/last7" },
    { "url": "https://www.gutenberg.org/browse/titles/h" }
	]
}

```

## Gutenberg Ebook Output
The structure of each item in Gutenberg ebooks looks like this:
```json
{
  "author": "United States. National Park Service",
  "title": "Cumberland Island: Junior Ranger Program Activity Guide for Ages 5-7",
  "language": "English",
  "htmlURL": "https://www.gutenberg.org/files/61452/61452-h/61452-h.htm",
  "epubURL": "https://www.gutenberg.org/ebooks/61452.epub.images?session_id=24e44a13d40847bb8d8b13a9216689880a3221cf",
  "kindleURL": "https://www.gutenberg.org/ebooks/61452.kindle.images?session_id=24e44a13d40847bb8d8b13a9216689880a3221cf",
  "plainTextURL": "https://www.gutenberg.org/files/61452/61452-0.txt"
}
```

### Extend output function

You can use this function to update the default output of this actor. This function gets a JQuery handle `$` as an argument so you can choose what data from the page you want to scrape. The output from this will function will get merged with the default output.

The return value of this function has to be an object!

You can return fields to achive 3 different things:
- Add a new field - Return object with a field that is not in the default output
- Change a field - Return an existing field with a new value
- Remove a field - Return an existing field with a value `undefined`


### Compute Unit Consumption
The actor optimized to run blazing fast and scrape many product as possible. Therefore, it forefronts all product detail requests. If actor doesn't block very often it'll scrape ~250 products in 3 minutes with 0.0235 compute units.

## During the Run

During the run, the actor will output messages letting you know what is going on. Each message always contains a short label specifying which page from the provided list is currently specified.
When items are loaded from the page, you should see a message about this event with a loaded item count and total item count for each page.

If you provide incorrect input to the actor, it will immediately stop with failure state and output an explanation of what is wrong.

## Gutenberg Export

During the run, the actor stores results into a dataset. Each item is a separate item in the dataset.

You can manage the results in any languague (Python, PHP, Node JS/NPM). See the FAQ or <a href="https://www.apify.com/docs/api" target="blank">our API reference</a> to learn more about getting results from this Gutenberg actor.

