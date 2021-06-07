const { makeExecutableSchema } = require('graphql-tools')
const {
    Book,
    User,
    Product,
    Sales,
    Transaction,

    Query,
    Mutation
} = require('../typeDefs')
const resolvers = require('../resolvers') 

const schema = makeExecutableSchema({
    typeDefs: [
        Query,
        Mutation,

        Book,
        User,
        Product,
        Sales,
        Transaction
    ],
    resolvers
})

module.exports = schema