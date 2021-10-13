const {UserInputError} = require('apollo-server');
const generateSku = require('../utils/generate-sku');

const productMutation = {
    createProductCategory: async(_parent, args, context) => {

        const { count } = await context.db
        .from('product_category')
        .select('name', { count: 'exact' }).eq('name', args.name)

        if(count > 0) {
            throw new UserInputError('Product category already exist.');
        }

        const {data, error} = await context.db
        .from('product_category')
        .insert({name: args.name});

        if(error) {
            throw new Error({
                message: 'Insert failed. Please try again',
                error
            })
        }

        return data
    },
    updateProductCategory: async(_parent, args, context) => {

        const { error: authError, data: authData } = await context.db.auth.api
        .getUser(context.auth)

        const { count } = await context.db
        .from('product_category')
        .select('name', { count: 'exact' }).eq('name', args.name);


        if(count > 0) {
            throw new UserInputError('Product category already exist.');
        }

        const {data, error} = await context.db
        .from('product_category')
        .upsert({name: args.name, id: args.id});


        if(error) {
            throw new Error('Insert failed. Please try again')
        }

        return data
    },
    createProductUnit: async(_parent, args, context) => {

        const { count } = await context.db
        .from('product_unit')
        .select('name', { count: 'exact' })
        .eq('name', args.name)

        if(count > 0) {
            throw new UserInputError('Product unit already exist.');
        }

        const {data, error} = await context.db
        .from('product_unit')
        .insert({name: args.name});

        if(error) {
            throw new Error({
                message: 'Insert failed. Please try again',
                error
            })
        }

        return data
    },
    createProduct: async(_parents, args, context) => {
        const payload = args.product;

        const {data, error, count} = await context.db
        .from('product')
        .select('barcode, name')
        .or(`barcode.eq.${payload.barcode},name.eq.${payload.name}`)


        if(data.length) {
            throw new UserInputError('Product already exist.');
        } else {
            const {data, error} = await context.db
            .from('product')
            .insert({
                barcode: payload.barcode,
                name: payload.name,
                price: payload.price,
                cost: payload.cost,
                description: payload.description,
                product_category_id: payload.category,
                product_unit_id: payload.unit,
                sku: generateSku(payload)
            })

            if(error) {
                throw new Error({
                    message: 'Insert product failed. Please try again',
                    error
                })
            } 

            const {data: inventoryData, error: err} = await context.db
            .from('product_inventory')
            .insert({
                product_id: data[0].id,
                quantity: payload.quantity
            })

            if(err) {
                throw new Error({
                    message: 'Insert product failed. Please try again',
                    error
                })
            }

            return [
              {
                ...data[0],
                inventory: inventoryData[0]
              },
            ]
        }
    },
    updateProductStock: async(_parents, args, context) => {
        const {data, error} = await context.db
        .from('product_inventory')
        .insert({
            product_id: args.productId,
            quantity: args.quantity
        })
        .single();

        if(error) {
            throw new Error({
                message: 'Insert product failed. Please try again',
                error
            })
        }
        return data
    }
}

const productQuery = {
    getProductCategories: async(_parent, _args, context) => {
        const {data, error} = await context.db
        .from('product_category')
        .select(`id, name, dateAdded: date_added`)
        .order('id', { ascending: true })

        if(error) {
            throw new Error(error.stringify())
        }

        return data
    },
    getProductUnit: async(_parent, _args, context) => {
      const {data, error} = await context.db
      .from('product_unit')
      .select(`id, name, dateAdded: date_added`)
      .order('id', { ascending: true })

      if(error) {
          throw new Error(error.stringify())
      }

      return data
    },
    getProductInventory: async(_parents, _args, _context) => {
      return []
    },
    getProducts: async(_parents, _args, context) => {

      const {data, error} = await context.db
      .from('product')
      .select(`
        id,
        barcode,
        name,
        unit: product_unit_id (id, name),
        inventory: product_inventory.id (quantity),
        category: product_category (id, name)
      `)

      if(error) {
        return []
      }

      return data
    },
    // search product item by product barcode or sku
    findProductBySkuCode: async(_parents, _args, _context) => {
      const {data, error} = await _context.db
        .from('product')
        .select(`
            id,
            barcode,
            name,
            description,
            unit: product_unit_id (id, name),
            inventory: product_inventory.id (quantity),
            category: product_category (id, name),
            price,
            cost
            `,
        )
        .or(`barcode.eq.${_args.code},sku.eq.${_args.code}`)
        .single();

      if(error) {
        console.log(`Find Product not found: ${error.message} \n code: ${_args.code}`)
        throw new Error(`Find Product not found: ${error.message} \n code: ${_args.code}`)
      }

      return data
    },
    getTempProducts: async(_, args, context) => {
      const {data} = await context.db
      .from('temp_product')
      .select('id, name: Name, price: Price, category: Category, slug: Slug')
      .limit(10)

      return data
    },
    getTempProductBySlug: async(_, args, context) => {
      const {data} = await context.db
      .from('temp_product')
      .select('id, name: Name, price: Price, category: Category, slug: Slug, brand: Brand')
      .eq('Slug', args.slug)
      .single()

      return data
    },
    getTempProductByCategory: async(_, args, context) => {
      const {data} = await context.db
      .from('temp_product')
      .select('id, name: Name, price: Price, category: Category, slug: Slug, brand: Brand')
      .eq('Category', args.category)
      .limit(18)

      return data
    },
    getTempProductCategory: async(_, args, context) => {
      const { 
        data, 
      } = await context.db.rpc('select_distinct_category')
    
      return data
    }
}

const ProductResolver = {
  ProductList: {
    inventory(parent) {
        return {
            quantity: parent.inventory.reduce((a, b) => a + b.quantity, 0)
        }
    }
  },
  ProductInventory: {
    productId(parent) {
        return parent.product_id
    } 
  }
}

module.exports = {
  productMutation,
  productQuery,
  ProductResolver
}