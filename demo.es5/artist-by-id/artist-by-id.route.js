module.exports = {
  getById: {
    accepts: [
      { 
        arg: 'id', 
        type: 'string', 
        required: true, 
        default: '1Cs0zKBU1kc0i8ypK3B9ai' 
      }
    ],
    http: {
      verb: 'GET',
      path: '/artist/:id'
    }, 
    returns: {
      root: true
    } 
  },
  isEnable: true
}