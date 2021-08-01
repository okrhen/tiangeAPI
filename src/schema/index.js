const { makeExecutableSchema } = require('graphql-tools')
const {
    User,
    Product,
    Sales,
    Transaction,
    Taxes,

    Query,
    Mutation
} = require('../typeDefs')
const resolvers = require('../resolvers') 

const schema = makeExecutableSchema({
    typeDefs: [
        Query,
        Mutation,

        // types
        User,
        Product,
        Sales,
        Transaction,
        Taxes
    ],
    resolvers
})

module.exports = schema