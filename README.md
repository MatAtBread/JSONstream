# json2objectstream

A node stream transformer that reads characters and produces JSON objects. It's happy with multiple objects in the same stream.

## Installation

```
npm install json2objectstream
```

## Usage

```
const JSONStream = require('json2objectstream');

// Create the transformer stream
const s = new JSONStream() ;

// Every time the stream reads a complete object, it will emit a 'data' event
s.on('data', object => console.log(object));

// Test it by piping in some JSON from the command line
process.stdin.pipe(s);
```

From the command line:

`node json2objectstream < mydata.json`    or pipe some data into it

When used from the CLI, an optional second parameter can be used to manipulate the object:

`node json2objectstream "_.aField" < mydata.json`

...in this case `_` is the current object

