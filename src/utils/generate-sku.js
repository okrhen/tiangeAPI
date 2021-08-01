function makeid(length) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

const generateSku = (payload) => {

    const productName = payload.name.replace(/' '/g, '');
    const middle = (productName.substring(0, 3)+''+productName.substring(productName.length - 3, productName.length)).toUpperCase();
    const suffix = makeid(4).toUpperCase();

    return `${payload.category}${payload.unit}-${middle}-${suffix}`
}

module.exports = generateSku