# JSON Markdown Table

An node module that creates markdown tables containing formatted JSON data, perfect for Yadda test cases.

## Installation

pending: npm install json-markdown-table

## Usage

###.createJSONMarkdownTable(data)
Data for a markdown table will look something like this:
```javascript
[ 
  [ 
    { 
      "value" : "header1" 
    },
    { 
      "value" : "header2" 
    },
    { 
      "value": "header3" 
    } 
  ],
  [ 
    { 
      "value" : "value1" 
    },
    { 
      "value" : "value2" 
    },
    { 
      "value" : '{"mack":"levine","sara":"fraley"}'
    } 
  ] 
]
```
For the above object, .createJSONMarkdownTable() will return a string that looks like this:

```
|-------|-------|-------------------|
|header1|header2|header3            |
|-------|-------|-------------------|
|value1 |value2 |{                  |
|       |       |  "mack": "levine",|
|       |       |  "sara": "fraley" |
|       |       |}                  |
|-------|-------|-------------------|


```

## Contributing

TBD

## Improvements!

TODO: add the ability to accept Objects as cell values. Identify them, and stringify them.

## Credits

Mack Levine

## License

[MIT](LICENSE)