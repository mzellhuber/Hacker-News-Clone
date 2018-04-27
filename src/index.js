const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')


//resolvers
/*

NO LONGER NEEDED SINCE I'M USING PRISMA ☺️ 

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
    },
    updateLink: (root, args) => {
      const link = links.find(item => {
         return item.id == args.id

      });
      if (!link) {
        throw new Error('Could not find link with id ${linkId}')
      };
      link.url = args.url;
      link.description = args.description;

      return link;
    },
    deleteLink:(root, args) => {
      const link = links.find(item => {
         return item.id == args.id

      });
      if (!link) {
        throw new Error('Could not find link with id ${linkId}')
      };
      console.log(links)
      //delete links[link];
      links.splice(links.indexOf(link), 1);

      console.log(links)
      return link
    }
  },
}
*/

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info)
    },
  },
  Mutation: {
    post: (root, args, context, info) => {
      return context.db.mutation.createLink({
        data: {
          url: args.url,
          description: args.description,
        },
      }, info)
    },
  },
}

// server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://us1.prisma.sh/public-juniperneck-282/hackernews-node/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  }),
})
server.start(() => console.log('Server is running on http://localhost:4000'))