const User = `
  type User {
    id: ID!
    firstname: String
    lastname: String
    email: String
    username: String
    password: String
    mobileNumber: String
    role: UserRole
    dateCreated: Date
    token: String
  }

  type UserRole {
    id: ID!
    name: String
    dateCreated: Date
  }

  type LoginSuccess {
    token: String!
  }

  input CreateUser {
    email: String!
    password: String!
  }

  type SignInSuccess {
    token: String!
  }
  
`;


module.exports = User;