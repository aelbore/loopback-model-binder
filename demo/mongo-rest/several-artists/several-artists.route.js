module.exports = {
  getSeveralArtists: {
    accepts: [
      { 
        arg: 'ids', 
        type: 'string', 
        required: true, 
        default: '4gzpq5DPGxSnKTe4SA8HAU' 
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