import express from 'express'

const app = express()

app.get('/posts', async (req, res) => {
  console.info(req.url)
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8080')

  try {
    return res.status(200).json([
      {
        title: 'post1',
        summary: 'post summary',
        content: 'post contents',
      },
      {
        title: 'post2',
        summary: 'post2 summary',
        content: 'post2 contents',
      },
      {
        title: 'post3',
        summary: 'post3 summary',
        content: 'post3 contents',
      }
    ])
  } catch (e) {
    console.log('api error', e.message)
    return res.status(400).send(e.message)
  }
})

app.listen(3000, () => console.log('Api Server Started: http://127.0.0.1:3000, press Ctrl+C to quit'))
