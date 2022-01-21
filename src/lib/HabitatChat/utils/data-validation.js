function checkObjectValid (obj, key) {
  return (
    Object.prototype.hasOwnProperty.call(obj, key) &&
    obj[key] !== null &&
    obj[key] !== undefined
  )
}

export function channelsValidation (obj) {
  const channelsValidate = [
    { key: 'channelId', type: ['string', 'number'] },
    { key: 'channelName', type: ['string'] },
    { key: 'users', type: ['array'] }
  ]

  const validate = (obj, props) => {
    return props.every(prop => {
      let validType = false

      if (prop.type[0] === 'array' && Array.isArray(obj[prop.key])) {
        validType = true
      // eslint-disable-next-line valid-typeof
      } else if (prop.type.find(t => t === typeof obj[prop.key])) {
        validType = true
      }

      return validType && checkObjectValid(obj, prop.key)
    })
  }

  if (!validate(obj, channelsValidate)) {
    throw new Error(
      'Channels object is not valid! Must contain channelId[String, Number], channelName[String] and users[Array]'
    )
  }
}

export function partcipantsValidation (obj) {
  const participantsValidate = [
    { key: '_id', type: ['string', 'number'] },
    { key: 'fullName', type: ['string'] }
  ]

  const validate = (obj, props) => {
    return props.every(prop => {
      // eslint-disable-next-line valid-typeof
      const validType = prop.type.find(t => t === typeof obj[prop.key])
      return validType && checkObjectValid(obj, prop.key)
    })
  }

  if (!validate(obj, participantsValidate)) {
    throw new Error(
      'Participants object is not valid! Must contain _id[String, Number] and username[String]'
    )
  }
}

export function messagesValidation (obj) {
  const messagesValidate = [
    { key: '_id', type: ['string', 'number'] },
    { key: 'content', type: ['string', 'number'] },
    { key: 'senderId', type: ['string', 'number'] }
  ]

  const validate = (obj, props) => {
    return props.every(prop => {
      // eslint-disable-next-line valid-typeof
      const validType = prop.type.find(t => t === typeof obj[prop.key])
      return validType && checkObjectValid(obj, prop.key)
    })
  }

  if (!validate(obj, messagesValidate)) {
    throw new Error(
      'Messages object is not valid! Must contain _id[String, Number], content[String, Number] and senderId[String, Number]'
    )
  }
}
