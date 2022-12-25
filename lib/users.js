const users = {};
const User = require('./model/user.model');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const configuration = require('./config/configuration');


// Vi henter brugere via Mongo find() metoden.
users.getUsers = (callback) => {

    User.find({}).then( (result) => {

      return callback(200, {'message' : 'Brugerlisten er opdateret', 'result' : result});

    })

};

// Henter en bruger på bagrund af brugerens ID.
users.getUserByID = (id, callback) => {

  let query = {'_id' : id}

  User.findOne(query).then( (result) => {
    callback(200, {'message' : 'Her er din bruger', 'result' : result})
  })

}

// Sletter en bruger med Email som identifier.
users.deleteUser = (payload, callback) => {

    let query = {'email' : payload.email};
  
    User.deleteOne(query).then( (result) => {
  
      if(result.deletedCount === 0)
      {
        callback(200, {'message' : 'Brugeren kunne ikke slettes', 'result' : {}})
      }
      else {
  
        callback(200, {'message' : 'Brugeren er slettet', 'result' : result})
        
      }
  
  
    }).catch(error =>  callback(503, error))
  
};

// Opretter en ny bruger. Vi undersøger at en bruger ikke allerede er oprettet med samme email
users.registerUser = (payload, callback) => {

    let query = {'email' : payload.email};

    User.find(query).then( (result) => {

      if(result.length === 0) {

        bcryptjs.hash(payload.password, 10).then( (encrpytedPassword) => {

          payload.password = encrpytedPassword;

          // Hvis vi ikke finder en bruger opretter vi en ny med vores payload.
          User.create(payload).then( () => {
  
              callback(200, {'message' : 'Ny bruger er oprettet'});
  
          })

        })
      
      } else {

        // Vi returnere en besked om at brugeren ikke kunne oprettes.
        callback(200, {'message' : 'Bruger kunne ikke oprettes'})

      }

    });

};

// Vi opdatere en brugers data, vi benytter email til at identificere vores bruger.
users.updateUser = (payload, callback) => {

    let query = {'email' : payload.email};

    User.findOneAndUpdate(query, payload).then( (user) => {

      console.log(`${user.name} er opdateret.`)
      callback(200, {'message' : `Bruger ${user.name} er opdateret`});

    });

}

// Vi benytter dette endpoint til at opdatere brugerens profil billede.
users.updateProfile = (payload, callback) => {

  let query = {'_id' : payload.userId};

  User.findOneAndUpdate(query, payload).then( (user) => {

    console.log(`${user.name} - Profil billede er opdateret.`);
    callback(200, {'message' : `Profil billede til ${user.name} er opdateret`});

  });

}


// Vi benytter dette end point til at logge en bruger på.
users.loginUser = (payload, callback) => {

    let query = {'email' : payload.email};
    const expiresIn = configuration.serverCookieExpire; // I Sekunder.
    const secretKey = configuration.secretKey;

    User.findOne(query).then( (user) => {

      console.log(`Vi har fundet denne bruger ${user.name}`);

      if(user) {
        
        bcryptjs.compare(payload.password, user.password).then( (valid) => {

          if(valid) {

            console.log(`${user.name}´s password er valid og vi tillader login.`);

            const token = jwt.sign(
              {
                _id : user._id,
                email : user.email,
                color: 'red',
                name: user.name,
                username: user.username
              },
              secretKey, {
                expiresIn : expiresIn
              }
            )

            callback(200, {'message' : 'Brugeren er logget ind', 'result' : user, 'token' : token, 'expire' : expiresIn})

          } else {

            callback(200, {'message' : 'Brugeren kan IKKE logges ind'})

          }

        })
      }
      else {

        callback(200, {'message' : 'Brugeren kan IKKE logges ind'})

      }

    })
}

module.exports = users;