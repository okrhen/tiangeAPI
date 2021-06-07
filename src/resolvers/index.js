const SHA256 = require("crypto-js/sha256");
const { AuthenticationError } = require('apollo-server');
const {books} = require('../data/books');
const { getUser } = require("./helpers");
const {productMutation, productQuery} = require('./product')
const {userMutation, userQuery} = require('./user-resolver')

const resolvers = {
    Query: {
      books: () => books,
      book: (parent, args, context, info) => {
          return books.find(i => i.title === args.title)
      },
      users: async (parent, args, context, info) => {
          const users = await context.db
          .select(
            'id',
            'email', 
            'firstname')
          .from('user')

          return users
      },
      getUserRoles: async(parent, args, context, info) => {
          const user = await getUser(context.auth);
          if(user) {
            const userRoles = await context.db('user_role')
            .select('*', 'date_created as dateCreated');

            return userRoles;
          }
      },
      ...productQuery,
      ...userQuery
    },
    Mutation: {
        createUser: async (_, {user}, {db}) => {

            const dbUser = await db
            .select('username')
            .from('user')
            .where({username: user?.username});

            if(dbUser.length) {
                throw new Error('Username already exists!')
            }

            const encryptedPassword = SHA256(user?.password).toString();
            const newUser = await db('user').insert({
                firstname: user?.firstname,
                lastname: user?.lastname,
                email: user?.email,
                password: encryptedPassword,
                mobile_number: user?.mobileNumber,
                username: user?.username,
                role_id: user?.roleId,
            })
            .returning(['id','firstname', 'lastname', 'email', 'username'])
            return newUser
        },
        createRole: async(_, {roleName}, {db}) => {
            const dbUserRole = await db
            .select('name')
            .from('user_role')
            .where({name: roleName});

            if(dbUserRole.length) {
                throw new Error('Role name already exists!')
            }

            const newUserRole = await db('user_role').insert({
                name: roleName
            }).returning(['id', 'name', 'date_created as dateCreated'])

            console.log('newUserRole ==>', newUserRole)

            return newUserRole
        },
        login: async(_, {username, password}, {db}) => {
            const encryptedPassword = SHA256(password).toString();
            const user = await db('user')
            .select('id', 'username', 'email')
            .where({
                username: username,
                password: encryptedPassword
            }).first()

            if(user) {
                return {
                    token: getToken(user)
                }
            }
    
            throw new AuthenticationError('User is not found!');
        },
        ...productMutation,
        ...userMutation
    }
  };

module.exports = resolvers