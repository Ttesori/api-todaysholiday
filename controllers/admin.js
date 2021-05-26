const Holiday = require('../models/Holiday');
const Tag = require('../models/Tag');

module.exports = {
  getAdminIndex: (req, res) => {
    res.render('admin-login', {
      title: 'Admin Login',
      error: req.query.error
    });
  },
  loginAdmin: (req, res) => {
  },
  logoutAdmin: (req, res) => {
    req.logout();
    res.redirect('/admin')
  },
  getHolidaysByMonth: async (req, res) => {
    try {
      let results = await Holiday.find({ month: req.params.month }).populate('tags').sort({ day: 1 });
      let tags = await Tag.find().sort({ name: 1 });
      tags.forEach(tag => {
        let count = 0;
        results.forEach(result => {
          if (result.tags[0] && (tag.name === result.tags[0].name)) count++;
        });
        tag.count = count;
      });
      let month = parseInt(req.params.month);
      res.render('admin-index.ejs', {
        data: {
          results: results,
          months: ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          currMonth: month,
          prevMonth: month === 1 ? 12 : month - 1,
          nextMonth: month === 12 ? 1 : month + 1,
          tags: tags,
        },
        title: 'Admin Dashboard',
        bodyClass: 'th-page-admin'
      });
    } catch (err) {
      console.log(err);
    }
  },
  manageTags: async (req, res) => {
    try {
      let results = await Holiday.find().populate('tags').sort({ day: 1 });
      let tags = await Tag.find().sort({ name: 1 });
      tags.forEach(tag => {
        let count = 0;
        results.forEach(result => {
          if (result.tags[0] && (tag.name === result.tags[0].name)) count++;
        });
        tag.count = count;
      });
      res.render('admin-tags.ejs', {
        data: {
          tags: tags
        },
        title: 'Manage Tags',
        bodyClass: 'th-page-tags'
      });
    } catch (err) {
      console.log(err);
    }
  }
}