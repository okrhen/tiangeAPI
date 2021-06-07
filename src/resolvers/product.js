const {UserInputError} = require('apollo-server');

const productMutation = {
    createProductCategory: async(parent, args, context) => {

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
    updateProductCategory: async(parent, args, context) => {

        const { error: authError, data: authData } = await context.db.auth.api
        .getUser(context.auth)

        console.log('authError ==>', context)
      

        const { count } = await context.db
        .from('product_category')
        .select('name', { count: 'exact' }).eq('name', args.name);


        if(count > 0) {
            throw new UserInputError('Product category already exist.');
        }

        const {data, error} = await context.db
        .from('product_category')
        .upsert({name: args.name, id: args.id});

        console.log('error ==>', error)

        if(error) {
            throw new Error('Insert failed. Please try again')
        }

        return data
    },
}

const productQuery = {
    getProductCategories: async(parent, args, context) => {
        const {data, error} = await context.db
        .from('product_category')
        .select(`id, name, dateAdded: date_added`)
        .order('id', { ascending: true })

        if(error) {
            throw new Error(error.stringify())
        }

        return data

    } 
}

module.exports = {productMutation, productQuery}