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
  }

  input CreateProduct  {
    barcode: String
    name: String
    productCategoryID: ID!
    storeID: ID!
    cost: Float
    price: Float
    quantity: Int
    quantityType: ID
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

  type ProductInvetory {
    id: ID!
    product: Product
    quantity: Int
    dateAdded: Date
    user: User
    dateCreated: Date
  }
    
`;


module.exports = Product;