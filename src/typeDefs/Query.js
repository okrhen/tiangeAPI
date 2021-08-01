const Query = `
  type Query {
    users: [User]
    getUserRoles: [UserRole]

    getProductCategories: [ProductCategory]
    getProductUnit: [ProductUnit]
    getProductInventory(id: ID): Int
    getProducts: [ProductList]
    findProductBySkuCode(code: String!): ProductList

    getActiveSalesTransaction(transactionNumber: ID!): SalesTransactionItems
    
    getTaxData(name: String!): Tax
  }
`;

module.exports = Query