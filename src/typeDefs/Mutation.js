const Mutation = `
  type Mutation {
    createUser(user: CreateUser): [User] 
    createRole(roleName: String!): [UserRole]
    login(username: String!, password: String!): User

    createProductCategory(name: String!): [ProductCategory]
    updateProductCategory(name: String!, id: ID!): [ProductCategory]
    createProduct(product: InputCreateProduct!): [Product]
    createProductUnit(name: String!): [ProductUnit]
    updateProductStock(productId: ID!, quantity: Float): ProductInventory

    signUpUser(email: String!, password: String!): String
    signInUser(email: String!, password: String!): SignInSuccess

    createSaleTransaction: Sales
    createTransaction(transactionNumber: ID!, code: String!, quantity: Float!): TransactionStatus
    salesMakePayment(transactionNumber: ID!, amountReceived: Float!, paymentType: String!): SalesPaymentSuccess
  }
`;

module.exports = Mutation