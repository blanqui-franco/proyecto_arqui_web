try {
  module.exports = require('./recipes-data');
} catch {
  module.exports = require('../recipes-service/data');
}
