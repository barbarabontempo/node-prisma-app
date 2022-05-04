import { PrismaClient } from '@prisma/client'
import express from 'express'
import tracer from './tracer'
import 'dd-trace/init'; 

const prisma = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      }
    ]
  })
  
const app = express()

app.use(express.json())



prisma.$use(async (params, next) => {
// You can also add any tag relevant for you, and change the service name if
// needed with the `service.name` tag. If you have this information anywhere,
// make sure to add `out.host` and `out.port` tags as the UI will be able to
// group your instances together.
  const tags = {
// The resource name is how things are grouped in the UI. This would usually
// include the query if you have it, although you should first obfuscate it
// since our agent doesn't know how to obfuscate Prisma.
    'span.kind': 'client',
    'span.type': 'sql',
    'prisma.model': params.model,
    'prisma.action': params.action
  }
  // Using tracer.trace() means that the span will automatically be a child of
  // any current span, errors will be handled, and any span created in `next`
  // will be a child of this span.
  return tracer.trace('prisma.query', { tags }, () => next(params))
})

prisma.$on('query' as any, async (e: any) => {
  const span = tracer.scope().active() // the span from above

  span?.setTag('resource.name', e.query)
});

async function main() {
  await prisma.user.findMany({
    include: { posts: true },
  })
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany()
    res.json(users)
})

app.get('/feed', async (req, res) => {
    const posts = await prisma.post.findMany({
        where: { published: true },
        include: { author: true }
    })
    res.json(posts)
})

app.get(`/post/:id`, async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.findMany({
        where: { id: Number(id) },
    })
    res.json(post)
})

app.post(`/user`, async (req, res) => {
    const result = await prisma.user.create({
        data: { ...req.body },
    })
    res.json(result)
})

app.post(`/post`, async (req, res) => {
    const { title, content, authorEmail } = req.body
    const result = await prisma.post.create({
        data: {
            title,
            content,
            published: false,
            author: { connect: { email: authorEmail } },
        },
    })
    res.json(result)
})

app.put('/post/publish/:id', async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { published: true },
    })
    res.json(post)
  })
  
  app.delete(`/post/:id`, async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.delete({
      where: { id: Number(id) },
    })
    res.json(post)
  })

app.listen(3000, () =>
    console.log('REST API server ready at: http://localhost:3000'),
)

