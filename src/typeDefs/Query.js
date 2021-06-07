const Query = `
  type Query {
    books: [Book]
    book(title: String!): Book
    users: [User]
    getUserRoles: [UserRole]

    getProductCategories: [ProductCategory]
  }
`;

module.exports = {
    Query
}