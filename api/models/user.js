// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : {
          type: String,
          lowercase: true,
          unique: true,
          required: true
        },
        password     : {
          type: String,
          required: true
        },
        admin         : {
          type: Boolean,
          default: false
        },
        validator         : {
          type: Boolean,
          default: false
        },
        user         : {
          type: Boolean,
          default: true
        },
        staff         : {
          type: Boolean,
          default: false
        },
        firstname    : {
          type: String
        },
        lastname     : {
          type: String
        },
        gravatar: {
          type: String
        },
        created: {
          type: Date,
          default: Date.now
        }
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
