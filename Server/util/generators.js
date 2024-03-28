//all in one generator
//you pass (bool, bool, bool, int)
genAllInOne = (isOnlyDigits, isOnlySmall, isOnlyCaps, length) => {
    var allSmall = 'abcdefghjkmnpqrstuvwxyz';
    var allCaps = 'ABCDEFGHJKMNPQRSTUVWXYZ'
    var allDigits = '0123456789';
    let genRes = '';

    if (isOnlyDigits && isOnlySmall && isOnlyCaps) {
        var reqString = allDigits + allSmall + allCaps;
    } else if (isOnlyDigits && isOnlySmall && !isOnlyCaps) {
        var reqString = allDigits + allSmall;
    } else if (isOnlyDigits && !isOnlySmall && isOnlyCaps) {
        var reqString = allDigits + allCaps;
    } else if (isOnlyDigits && !isOnlySmall && !isOnlyCaps) {
        var reqString = allDigits;
    } else if (!isOnlyDigits && isOnlySmall && isOnlyCaps) {
        var reqString = allSmall + allCaps;
    } else if (!isOnlyDigits && isOnlySmall && !isOnlyCaps) {
        var reqString = allSmall;
    } else if (!isOnlyDigits && !isOnlySmall && isOnlyCaps) {
        var reqString = allSmall;
    } else {
        return genRes;
    }

    for (let i = 0; i < length; i++) {
        genRes += reqString[Math.floor(Math.random() * reqString.length)];
    }
    return genRes;
};

module.exports = { genAllInOne };
