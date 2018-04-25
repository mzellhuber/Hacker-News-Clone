const { GraphQLServer } = require('graphql-yoga')


//resolvers
let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]
// 1
let idCount = links.length
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    // Fetch a single link by its `id`
    link(obj, args, context, info) {
      return links.find(item => {
         return item.id == args.id

      })
    },
    
  },
  Mutation: {
    // 2
    post: (root, args) => {
       const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    }
  },
}


// server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})
server.start(() => console.log('Server is running on http://localhost:4000'))