const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLList } = require('graphql');

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args, { loaders }) {
        return loaders.userLoader.load(args.id);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args, { loaders }) {
        return loaders.userLoader.loadMany(["1", "2", "3"]); // Example of batch fetching
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});

