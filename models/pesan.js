const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const pesanSchema = new Schema({
  idPangkalan: { type: String, required: true },
  idPembeli: { type: String, required: true },
  namaPangkalan: { type: String, required: true },
  namaPembeli: { type: String, required: true },
  photoPembeli: { type: String, required: true },
  photoPangkalan: { type: String, required: true },
  tanggal: { type: String, required: true },
  gas3Kg: { type: Number, required: true },
  gas12Kg: { type: Number, required: true },
  brightGas: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, required: true },
});

pesanSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Pesan", pesanSchema);
