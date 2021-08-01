const { roundAccurately } = require('../utils/number');
const {productQuery} = require('./product');

const salesMutation = {
    createSaleTransaction: async(_parent, _args, context) => {
        /**
         * 
         * status [pending, paid, cancelled]
         */
        const {data, error} = await context.db
        .from('sales')
        .insert({
            status: 'pending'
        })
        // .select('*, subTotal: sub_total')
        .single()

        if(error) {
            console.log('error ==>', error);
            throw new Error('Something went wrong!')
        }

        return data;
    },
    createTransaction: async(_parent, args, context) => {
        /**
         * check product if exist
        */ 
        const item = await productQuery.findProductBySkuCode(undefined, args, context)

        if(item) {
            const {price, id: productId} = item;
            let currentTotal =  price * args.quantity

            /**
             *  check if the product exist and transaction in sales_transaction
            */
            const {
                data: salesData, 
                error: salesError, 
                count: salesCount
            } = await context.db
            .from('sales_transaction')
            .select('*', { count: 'exact' })
            .match({
              transaction_number: args.transactionNumber,
              product_id: productId
            })

            if(salesError) {
                throw new Error(`Sales transaction error: ${salesError.message} `);
            }

            /**
             * if transaction_number and product exist
             * update sales transaction
            */
            if(salesCount > 0) {
              const existingProduct = salesData[0];
              currentTotal += existingProduct.total;

              const {
                  error: updatedSalesError
              } = await context.db
              .from('sales_transaction')
              .update({
                total: currentTotal,
                quantity: args.quantity + existingProduct.quantity
              })
              .match({
                transaction_number: args.transactionNumber,
                product_id: productId
              })

              if(updatedSalesError) {
                throw new Error(`Update Sales transaction error: ${updatedSalesError.message}`)
              }

              return {
                success: true
              }
            }

            /**
             * 
             * Insert new sales transaction
            */
            const {error} = await context.db
            .from('sales_transaction')
            .insert({
                transaction_number: args.transactionNumber,
                product_id: productId,
                quantity: args.quantity,
                total: currentTotal
            })

            if(error) {
                throw new Error(`Insert error: ${error.message}`)
            }

            return {
              success: true
            }
        }
    },
    salesMakePayment: async(_parent, args, context) => {
      const queryArgs = {transactionNumber: args.transactionNumber}
      const salesData = await salesQuery.getActiveSalesTransaction(_parent, queryArgs, context);
      const overallTotal = SalesResolver.SalesTransactionItems.overallTotal(salesData)
      const subTotal = await SalesResolver.SalesTransactionItems.subTotal(salesData, undefined, context)
      const vatAmount = await SalesResolver.SalesTransactionItems.vatAmount(salesData, undefined, context)
      
      const amountChange = roundAccurately(args.amountReceived - overallTotal);
      const paymentDate = new Date();

      const {data, error} = await context.db
      .from('sales')
      .update({
        overall_total: overallTotal,
        sub_total: subTotal,
        vat_total: vatAmount,
        amount_received: args.amountReceived,
        payment_type: args.paymentType,
        status: 'paid',
        amount_change: amountChange,
        payment_date: paymentDate
      })
      .eq('id', args.transactionNumber)
      .select('amountChange: amount_change')
      .single();

      if(error) {
        throw new Error(`Make Payment: ${error.message}`);
      }

      return data
    }
}

const salesQuery = {
  getActiveSalesTransaction: async(_parent, args, context) => {
    const {data, error} = await context.db
    .from('sales_transaction')
    .select(`
      salesTransactionId: id,
      quantity,
      total,
      product:product_id (
        name,
        barcode,
        unit: product_unit_id (id, name)
      )
    `)
    .eq('transaction_number', args.transactionNumber);

    if(error) {
      throw new Error(`Get active transaction: ${error.message}`)
    }

    return data
  }
}

const SalesResolver = {
  SalesTransactionItems: {
    productList(parent) {
      return parent
    },
    overallTotal(parent) {
      return parent.reduce((a, b) => a + b.total , 0)
    },
    totalItems(parent) {
      return parent.reduce((a, b) => a + b.quantity , 0)
    },
    async subTotal(parent, args, context) {
      const vatAmount = await SalesResolver.SalesTransactionItems.vatAmount(parent, args, context)
      const overallTotal = SalesResolver.SalesTransactionItems.overallTotal(parent, args, context)

      return roundAccurately(overallTotal - vatAmount);
    },
    async vatAmount(parent, args, context) {
      const {data} = await context.db
      .from('taxes')
      .select('rate')
      .eq('name', 'VAT')
      .single();

      const vatAmount = SalesResolver.SalesTransactionItems.overallTotal(parent, args, context) *  data.rate;
      return roundAccurately(vatAmount)
    }
  }
}

module.exports = {
    salesMutation,
    salesQuery,
    SalesResolver
}