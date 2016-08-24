module.exports = {
  getSeveralArtists: {
    accepts: [
      { 
        arg: 'ids', 
        type: 'string', 
        required: true, 
        default: '1Cs0zKBU1kc0i8ypK3B9ai,69GGBxA162lTqCwzJG5jLp' 
      }
    ],
    http: {
      verb: 'GET',
      path: '/several-artists/:ids'
    }, 
    returns: {
      root: true
    } 
  },
  isEnable: true
}