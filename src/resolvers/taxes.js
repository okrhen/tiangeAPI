const taxesQuery = {
  getTaxData: async(_parent, args, context) => {
    const {data, error} = await context.db
    .from('taxes')
    .select('*, dateAdded: date_added')
    .eq('name', args.name)
    .limit(1)

    if(error) {
      throw new Error(`Find tax data: ${error.message}`)
    }

    return data[0]
  }
}

module.exports = {
    taxesQuery
}