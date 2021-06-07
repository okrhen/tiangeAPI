const { AuthenticationError } = require("apollo-server-errors");

const userMutation = {
    signUpUser: async(parent, args, context) => {
        const { user, session, error } = await context.db.auth.signUp({
            email: args.email,
            password: args.password
          })
        
        if(error) throw new Error('Signup failed. Please try again.');

        return '/signup'
    },
    signInUser: async(parent, args, context) => {
        const { user, session, error } = await context.db.auth.signIn({
            email: args.email,
            password: args.password
        })

        if(error) {
            throw new AuthenticationError('Login failed!');
        }

        const {access_token: token} = session
        
        return {token}
    },
}

const userQuery = {}

module.exports = {
    userMutation,
    userQuery
}