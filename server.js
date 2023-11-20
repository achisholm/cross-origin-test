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
    const content = fs.readFileSync(filePath)
    res.setHeader('Content-Type', contentType)

    // Set CORS header based on filename
    if (filePath.endsWith('cors.html')) {
      res.setHeader('Access-Control-Allow-Origin', '*')
    }

    res.end(content)
  } else {
    // File not found, send 404 response
    res.statusCode = 404
    res.end('404 Not Found')
  }
})

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  if (PORT === 1337) {
    console.log(`- CORS Testing: http://localhost:${PORT}/cors.html`)
  } else if (PORT === 1338) {
    console.log(`- No CORS Testing: http://localhost:${PORT}/no-cors.html`)
  }  
})