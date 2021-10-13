const { AuthenticationError } = require("apollo-server-lambda");

const userMutation = {
    signUpUser: async(_, args, context) => {
      const { user,  error } = await context.db.auth.signUp({
          email: args.email,
          password: args.password
        })
      
      if(error) {
        console.log('error ==>', error)
          throw new Error(`Signup failed: ${error.message}`);
      }

      const {data, error: userError} = await context.db
      .from('user')
      .insert({
        uid: user.id,
      })

      if(userError) {
        throw new Error(`Signup failed: ${userError.message}`);
      }

      console.log('data ==>', data)
      

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