var http = require("http")
var fs = require("fs")

http.createServer(function (req, res) {
  res.writeHead(200, {"Content-Type": "image/gif"})

  // In production, you'd want to use some sort of caching here.
  // Either via a module such as http://npm.im/lactate or a separate
  // tool such as Nginx or Varnish
  var file = fs.createReadStream("./stream-animation.gif")
    .pipe(res)

}).listen(1337, "127.0.0.1")
console.log("Server running at http://127.0.0.1:1337/")