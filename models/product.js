const product = [];

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    //save data in product array
    product.push(this);
  }

  fetchAll() {
    //get data from product array
    return product;
  }
};
