const { Joi, celebrate } = require('celebrate');

const validURL = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/;

module.exports.validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(validURL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })
})

module.exports.validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })
})

module.exports.validationUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  })
})

module.exports.validationUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(validURL),
  })
})

module.exports.validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  })
})

module.exports.validationCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(20),
    link: Joi.string().required().pattern(validURL),
  })
})

module.exports.validationCardId = celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  })
})
