const roundAccurately = (number, decimalPlaces = 2) => {
    return Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces)
}

module.exports = {
    roundAccurately
}