[![Build Status](https://travis-ci.com/slaviczavik/stream-search.svg?branch=master)](https://travis-ci.com/slaviczavik/stream-search)

# Description
Node.js event based module for searching streams using the Boyer–Moore–Horspool algorithm.

# Requirements
Node.js 6.14.3 or higher is required.

# Installation
```
npm i @slaviczavik/stream-search
```

# Example

## Code

```JS
const StreamSearch = require('@slaviczavik/stream-search')
const search = new StreamSearch('AQD')

search.on('part', function (obj) {
  const isMatch = obj['isMatch']
  const start = obj['start']
  const end = obj['end']
  const data = obj['data']

  if (isMatch) {
    console.log(`Found! [${start} - ${end}]`)
  }
  else {
    console.log(`Not found!`)
  }

  if (data) {
    console.log(data.toString('ascii'))
  }
})

search.add('--AQD-QDD-DQD--')
search.end()
```
## Output

```
> Found! [2 - 4]
> --AQD
> Not found!
> -QDD-DQD--
```

# API

## Constructor
### `new StreamSearch(needle, limit)`

| Name | Required | Type | Description | Default
| - | - | - | - | - |
| `needle` | true | `string`, `buffer` | The needle what we are searching for. | `none` |
| `limit` | false | `integer` | The maximum number of matches. | `Infinity` |

**Number of matches is reseted after the `end` method calling.**

## Methods

### `add(haystack)`
Call this method every time you receive a new stream data.
If there were some unprocessed data in the previous request, this data will be processed with this new data.

| Parameter | Required | Type | Description
| - | - | - | - |
| `haystack` | true | `string`, `buffer` | Your data you want to search. |

### `end()`
Calling this method you signals that no more data will be passed.
If there are some trailing data (too few to run the algorithm), this data will be emitted back to user.

## Events

### `part(object)`
Emitted every time a match was or was not made. In both case, a processed chunk of data is available.
If match was made, the needle is between start (inclusive) and end (inclusive).

The object contains following properties:

| Property | Type | Description
| - | - | - |
| `isMatch` | `boolean` | Bool value that data contains the needle. |
| `data` | `buffer` | Returned data from the haystack. |
| `start` | `integer`, `undefined` | Start position of needle (if any) in the haystack (inclusive). |
| `end` | `integer`, `undefined` | End position of needle (if any) in the haystack (inclusive). |

**The property end also indicates the end of the data.**
