const currMonth = () => {
  return new Date().getMonth() + 1;
}
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/admin');
}
const isLoggedOut = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  res.redirect(`/admin/${currMonth()}`);
}

module.exports = {
  isLoggedIn,
  isLoggedOut,
  currMonth
}