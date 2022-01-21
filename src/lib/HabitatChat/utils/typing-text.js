export default (channel, currentUserId, textMessages) => {
  if (channel.typingUsers && channel.typingUsers.length) {
    const typingUsers = channel.users.filter(user => {
      if (user._id === currentUserId) return
      if (channel.typingUsers.indexOf(user._id) === -1) return
      if (user.status && user.status.state === 'offline') return
      return true
    })

    if (!typingUsers.length) return

    if (channel.users.length === 2) {
      return textMessages.IS_TYPING
    } else {
      return (
        typingUsers.map(user => user.username).join(', ') +
        ' ' +
        textMessages.IS_TYPING
      )
    }
  }
}
