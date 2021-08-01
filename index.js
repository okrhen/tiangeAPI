require('dotenv').config()

const { ApolloServer, AuthenticationError, } = require('apollo-server');
const db = require('./src/database');
const schema = require('./src/schema')

const server = new ApolloServer({
  schema, 
  context: async({req}) => {
    if(!req.headers.authorization) {
        return {
            db
        }
    }
    const auth = req.headers.authorization.split(' ')[1] || '';
    const {error} = await db.auth.api.getUser(auth)
    
    // optionally block the user
    // we could also check user roles/permissions here
    if (error) throw new AuthenticationError('You must be logged in.');

    // db.auth
    return {
        db
    }
  }
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});