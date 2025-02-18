
function isStore(req, res, next) {
  if (req.session.role === 'store') {
    next()
  } else {
    const error = 'You are not authorized to access this page'
    res.redirect(`/error?${error}`)
  }
}

function authorization(req, res, next) {
  const { UserId } = req.params
  if (req.session.userId === Number(UserId)) {
    next()
  }
  else {
    const error = 'Forbidden Access'
    res.redirect(`/error?error=${error}`)
  }
}

module.exports = {isStore, authorization}