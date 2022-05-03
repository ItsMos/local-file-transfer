import fs from 'fs'
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import { Router } from 'express'

const port = 1337
const app = express()
app.use(bodyParser.urlencoded({extended: true}))

app.use((req, res, next)=> {
  console.log(req.method, req.url)
  next()
})

let cmd = process.env.npm_lifecycle_script
let targetPath
// console.log('cmd:',cmd);
if (cmd === 'node index.js') {
  targetPath = 'C:/Users/NOZOM3/Desktop'
} else {
  cmd = cmd.replace(/"/g, '')
  targetPath = cmd.replace('node index.js ', '').replace('\\', '/')
}
// console.log('targetPath:', targetPath);

const router = new Router()
router.get('/files', (req, res)=> {
  let files = fs.readdirSync(path.join(targetPath), 'utf8')
  files = files.filter(f => {
    let st = fs.statSync(path.join(targetPath, f))
    return st.isFile()
  })
  let html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Files</title>
  </head>
  <body>
    <ol>
  `

  files.forEach(f => {
    html+= `<li><a href="/file/${f}">${f}</a></li>`
  })

  html += `
    </ol>
  </body>
  </html>
  `
  res.write(html)
  res.end()
})

router.get('/file/:file', (req, res)=> {
  let { file } = req.params
  res.sendFile(path.join(targetPath, file))
})

app.use(router)
app.listen(port)
console.log('Server listening on http://localhost:'+port)