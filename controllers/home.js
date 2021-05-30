module.exports = {
  getHome: (req, res) => {
    res.render('home.ejs', {
      api_base: 'https://todaysholiday.herokuapp.com/holidays'
    });
  }
}