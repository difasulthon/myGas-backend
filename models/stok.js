const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const stokSchema = new Schema({
  idPangkalan: { type: String, required: true },
  namaPangkalan: { type: String, required: true },
  photo: { type: String, required: true },
  totalStok: { type: Number, required: true },
  gas3Kg: { type: Number, required: true },
  gas12Kg: { type: Number, required: true },
  brightGas: { type: Number, required: true },
});

stokSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Stok", stokSchema);
