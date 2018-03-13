const swag = require('../models/swag');

module.exports = {
  add: (req, res, next) => {
    const {id} = req.query;
    let {cart} = req.session.user;

    // If the item is not in the cart, .findIndex will return -1
    const index = cart.findIndex(swag => swag.id == id);

    // Thus, if we don't have it in the cart...
    if (index === -1) {
      const selectedSwag = swag.find(swag => swag.id == id);

      cart.push(selectedSwag); // We'll add it to the cart
      req.session.user.total += selectedSwag.price; // And update our total price
    }

    res.status(200).send(req.session.user);
  },
  delete: (req, res, next) => {
    const {id} = req.query;
    const {cart} = req.session.user;

    const selectedSwag = swag.find(swag => swag.id == id);

    if (selectedSwag) {
      // Delete... It's like add but backwards.
      const i = cart.findIndex(swag => swag.id == id);
      cart.splice(i, 1);
      req.session.user.total -= selectedSwag.price;
    }

    res.status(200).send(req.session.user);
  },
  checkout: (req, res, next) => {
    const {user} = req.session;
    user.cart = [];
    user.total = 0;

    res.status(200).send(req.session.user);
  }
};
