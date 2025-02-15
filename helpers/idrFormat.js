function idrFormat(value) {
    let output = new Intl.NumberFormat
    ('id-ID', { 
      style: 'currency', 
      currency: 'IDR' 
    }).format(
      value,
    )

    return output
}


module.exports = idrFormat