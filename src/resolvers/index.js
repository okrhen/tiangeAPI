const {productMutation, productQuery, ProductResolver} = require('./product')
const {userMutation, userQuery} = require('./user-resolver')
const {salesMutation, salesQuery, SalesResolver} = require('./sales')
const {taxesQuery} = require('./taxes')

const resolvers = {
    Query: {
      ...productQuery,
      ...userQuery,
      ...salesQuery,
      ...taxesQuery
    },
    Mutation: {
        ...productMutation,
        ...userMutation,
        ...salesMutation
    },
    ...ProductResolver,
    ...SalesResolver
  };

module.exports = resolvers