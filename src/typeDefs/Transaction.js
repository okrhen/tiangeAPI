const Transaction = `
  type Transaction {
    id: ID!
    code: Int
    product: Product
    quantity: Int
    dateCreated: Date
  }
`;

module.exports = Transaction