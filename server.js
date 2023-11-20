const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const PORT = parseInt(process.argv[2]) || 3000

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const filePath = path.join(__dirname, parsedUrl.pathname)

  let contentType
  switch (path.extname(filePath)) {
    case '.js':
      contentType = 'application/javascript'
      break
    case '.html':
      contentType = 'text/html'
      break
  }

  // Check if file exists
  if (fs.existsSync(filePath)) {
    
    // Set headers before sending the response
    res.setHeader('Content-Type', contentType)
    
    // Set CORS header based on filename
    if (filePath.endsWith('no-cors.js')) {
      const content = fs.readFileSync(filePath)
      res.end(content)
    } else if (filePath.endsWith('cors.js')){
      res.setHeader('Access-Control-Allow-Origin', '*')
      const content = fs.readFileSync(filePath)
      res.end(content)
    } else {
      const content = fs.readFileSync(filePath)
      res.end(content)
    }
    
  } else {
    // File not found, send 404 response
    res.statusCode = 404
    res.end('404 Not Found')
  }
})

server.listen(PORT, () => {
  if (PORT === 1337) {
    console.log(`- CORS Testing: http://localhost:1338/cors.html`)
    console.log(`- No CORS Testing: http://localhost:1338/no-cors.html`)
  }
})
