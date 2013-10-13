var http = require("http")
var redis = require("redis")
var restify = require("restify")

// This requires you to be running a redis server locally,
// on the default port.
var client = redis.createClient()

var server = restify.createServer()

server.use(restify.queryParser())

server.get("/:key", function (req, res, next) {
  client.mget(req.params.key, req.params.key + ":modified", function (err, values) {
    if (err) {
      res.send(500, "Database error! Is Redis running?")
      return next()
    }
    var value = values[0]
    res.setHeader("last-modified", values[1] || "unknown")
    if (value == null)
      res.send(204) // No content
    else
      res.send(value)
    return next()
  })
})

server.del("/:key", function (req, res, next) {
  // In a real system you'd want to use Redis' MULTI/EXEC for this.
  client.del(req.params.key, function (err) {
    if (err) {
      res.send(500, "Database error! Is Redis running?")
      return next()
    }
    var modified_at = Date.now()
    client.set(req.params.key + ":modified", modified_at, function (err) {
      if (err) {
        res.send(500, "Database error! Is Redis running?")
        return next()
      }
      res.setHeader("last-modified", modified_at)
      res.send(204) // No Content
      return next()
    })
  })
})

server.post("/:key", function (req, res, next) {
  if (req.params.value != null) {
    client.set(req.params.key, req.params.value, function (err) {
      if (err) {
        res.send(500, "Database error! Is Redis running?")
        return next()
      }
      var modified_at = Date.now()
      client.set(req.params.key + ":modified", modified_at, function (err) {
        if (err) {
          res.send(500, "Database error! Is Redis running?")
          return next()
        }
        res.setHeader("last-modified", modified_at)
        res.send(202) // Accepted
        return next()
      })
    })
  }
  else {
    res.send(406)
    return next()
  }
})

server.listen(1337)
console.log("Server running at http://127.0.0.1:1337/")