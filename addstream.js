var add = require("./add.js")

var fs = require("fs")
var split = require("split")
var through2 = require("through2")

var prev
function transform(chunk, encoding, callback) {
  if (prev == null) {
    prev = chunk
  }
  else {
    var sum = add(prev, chunk)
    this.push(sum.toString() + "\n")
    prev = sum
  }
  return callback()
}

fs.createReadStream("./numbers.txt")
  .pipe(split())
  .pipe(through2(transform))
  .pipe(process.stdout)