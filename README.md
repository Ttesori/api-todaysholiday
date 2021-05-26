![Today's Holiday Logo](https://todaysholiday.herokuapp.com/img/th-logo.png)

# Today's Holidays API
This project is an API to serve up offbeat/funny holidays for a particular month or day. It also includes an administration area to manage the list of holidays.

**Link to project:** https://todaysholiday.herokuapp.com

## How It's Made:

**Tech used:** Node, Express, MongoDB, EJS, Javascript, Bootstrap, CSS

The application was originally designed as a simple CRUD API, but eventually wanted the ability to work with the API more easily and require authorization for certain tasks (creating, editing, and deleting holidays). I integrated PassportJS with a local strategy for authentication and built out an administration dashboard to manage the list of holidays. 

## Optimizations

Future optimizations that I'd like to add to this: 
- More robust alert/confirmation system when making changes on the administration dashboard.
- The ability to add multiple tags to a holiday through the administration dashboard.

## Lessons Learned:

This project taught me a whole host of lessons, including: how to implement authentication successfully, how to require authorization to access particular routes, how to organize a project with MVC architecture, and how to add new fields to an existing dataset.
