const { Types, Schema, model } = require('mongoose')

const LoginSchema = new Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
  });
  
  module.exports = model("loginschema", LoginSchema);