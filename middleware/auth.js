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
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).send('Unauthorized');
}

module.exports = {
  isLoggedIn,
  isLoggedOut,
  currMonth,
  isAuthenticated
}