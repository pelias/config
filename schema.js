const Joi = require('@hapi/joi');

module.exports = Joi.object().keys({
  addendum_namespaces: Joi.object().pattern(
    Joi.string().min(2), Joi.object().required().keys({
      type: Joi.string().valid('array', 'number', 'string', 'boolean').required()
    })
  )
}).unknown(true);
