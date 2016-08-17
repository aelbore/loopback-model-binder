module.exports = [
  {
    getRelatedArtistById: {
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
        path: '/related-artists/:id'
      }, 
      returns: {
        root: true
      } 
    },
    isEnable: true
  },
  {
    getArtistTopTracks: {
      accepts: [
        { 
          arg: 'id', 
          type: 'string', 
          required: true, 
          default: '1Cs0zKBU1kc0i8ypK3B9ai' 
        },
        { 
          arg: 'country', 
          type: 'string', 
          default: 'PH' 
        }
      ],
      http: {
        verb: 'GET',
        path: '/artist-top-tracks/:id/:country'
      }, 
      returns: {
        root: true
      } 
    },
    isEnable: true
  }
]