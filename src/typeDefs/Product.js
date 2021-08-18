const Product = `
  scalar Date

  type Product {
    id: ID!
    barcode: String
    name: String
    description: String
    cost: Float
    price: Float
    productCategory: ProductCategory
    productStatus: ProductStatus
    dateCreated: Date
    inventory: ProductInventory
  }

  input InputCreateProduct  {
    barcode: String!
    name: String!
    category: String!
    cost: Float
    price: Float
    quantity: Int
    unit: String!
    description: String
  }

  type ProductCategory {
    id: ID!
    name: String
    status: Boolean
    dateAdded: Date
  }

  type ProductStatus {
    id: ID!
    name: String
    dateCreated: Date
  }

  type ProductInventory {
    id: ID!
    productId: ID!
    product: Product
    quantity: Int
    dateAdded: Date
    user: User
    dateCreated: Date
  }

  type ProductUnit {
    id: ID!
    name: String
    status: Boolean
    dateAdded: Date
  }

  type ProductList {
    id: ID!
    barcode: String!
    description: String
    name: String!
    unit: ProductUnit
    category: ProductCategory
    inventory: ProductInventory
    cost: Float
    price: Float
  }

  type TempProducts {
    barcode: String!
    description: String
    name: String!
    category: String
    price: Float
    slug: String
    brand: String
  }

`;


module.exports = Product;