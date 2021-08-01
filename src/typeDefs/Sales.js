const Sales = `
  type Sales {
    id: ID!
    subTotal: Float
    netTotal: Float
    amountReceived: Float
    status: String
    dateCreated: Date
  }

  input SalesTransaction {
    code: String
    qty: Float
  }

  type TransactionStatus {
    success: Boolean
  }

  type SalesTransactionProducts {
    salesTransactionId: ID!
    quantity: Float
    total: Float
    product: ProductList
  }

  type SalesTransactionItems {
    productList: [SalesTransactionProducts]
    overallTotal: Float
    totalItems: Int
    vatAmount: Float
    subTotal: Float
  }

  type SalesPaymentSuccess {
    amountChange: Float
  }

  enum PaymentType {
    cash 
    others
  }
`;

module.exports = Sales