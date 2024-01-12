const { Joi, celebrate } = require('celebrate');

const valid = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/;

module.exports.validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(valid),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  })
})

module.exports.validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  })
})

module.exports.validationUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
  })
})

module.exports.validationUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(valid),
  })
})

module.exports.validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  })
})

module.exports.validationCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(20),
    link: Joi.string().required().pattern(valid),
  })
})

module.exports.validationCardId = celebrate({
  body: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  })
})
