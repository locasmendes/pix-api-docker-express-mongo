exports.validateKey = (strKey) => {
    const cpfRegex = /[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/gi;
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;

    if(cpfRegex.test(strKey.replace(/[^\d]+/g,''))) {
        return validateCpf(strKey)
    } else if(emailRegex.test(strKey)) {
        return true
    }
    return false

}

exports.empty = (data) => {
    if(typeof(data) == 'number' || typeof(data) == 'boolean')
    {
        return false;
    }
    if(typeof(data) == 'undefined' || data === null)
    {
        return true;
    }
    if(typeof(data.length) != 'undefined')
    {
        return data.length == 0;
    }
    let count = 0;
    for(var i in data)
    {
        if(data.hasOwnProperty(i))
        {
            count ++;
        }
    }
    return count === 0;
}

function validateCpf(strKey) {
    let sum;
    let resto;
    sum = 0;
    if (strKey === "00000000000") return false;

    for (let i=1; i<=9; i++) sum = sum + parseInt(strKey.substring(i-1, i)) * (11 - i);
    resto = (sum * 10) % 11;

    if ((resto === 10) || (resto === 11))  resto = 0;
    if (resto !== parseInt(strKey.substring(9, 10)) ) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(strKey.substring(i-1, i)) * (12 - i);
    resto = (sum * 10) % 11;

    if ((resto === 10) || (resto === 11))  resto = 0;
    return resto === parseInt(strKey.substring(10, 11));
}