module.exports = {
  getHome: (req, res) => {
    res.render('home.ejs', {
      api_base: 'https://todaysholidaysapi.com/holidays'
    });
  }
}