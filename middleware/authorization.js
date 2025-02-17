
function authorization(req, res, next) {
  if (req.session.role === 'store') {
    next()
  } else {
    const error = 'You are not authorized to access this page'
    res.redirect('/error', { error })
  }
}

module.exports = {authorization}