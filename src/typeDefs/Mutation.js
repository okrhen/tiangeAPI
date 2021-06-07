const Mutation = `
  type Mutation {
    createUser(user: CreateUser): [User] 
    createRole(roleName: String!): [UserRole]
    login(username: String!, password: String!): User

    createProductCategory(name: String): [ProductCategory]
    updateProductCategory(name: String, id: ID): [ProductCategory]
    createProduct(product: CreateProduct): [Product]

    signUpUser(email: String!, password: String!): String
    signInUser(email: String!, password: String!): SignInSuccess
  }
`;

module.exports = Mutation