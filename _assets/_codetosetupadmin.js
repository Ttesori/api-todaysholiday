
// app.get('/setup'), async (req, res) => {
//   const exists = await User.exists({ username: 'admin' });
//   if (exists) return res.redirect('/admin');

//   bcrypt.genSalt(10, function (err, salt) {
//     if (err) return next(err);
//     bcrypt.hash(<pass>, salt, function (err, hash) {
//       if (err) return next(err);
//       const newAdmin = new User({
//         username: "admin",
//         password: hash
//       });
//       newAdmin.save();
//       res.redirect('/admin');
//     })
//   })
// }