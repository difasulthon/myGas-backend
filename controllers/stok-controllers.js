const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const Stok = require("../models/stok");
const stok = require("../models/stok");

const getAllStok = async (req, res, next) => {
  let stok;
  try {
    stok = await Stok.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching stok failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ stok: stok.map((stok) => stok.toObject({ getters: true })) });
};

const getStokById = async (req, res, next) => {
  let idPangkalan = req.params.idPangkalan;

  let stok;
  try {
    stok = await Stok.findOne({ idPangkalan: `${idPangkalan}` });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a pangkalan.",
      500
    );
    return next(error);
  }

  if (!stok) {
    const error = new HttpError(
      "Could not find stok for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ stok: stok });
};

const createStok = async (req, res, next) => {
  const {
    idPangkalan,
    namaPangkalan,
    photo,
    totalStok,
    gas3Kg,
    gas12Kg,
    brightGas,
  } = req.body;

  let newStok;

  let existingStok;
  try {
    existingStok = await Stok.findOne({ idPangkalan: idPangkalan });
  } catch (err) {
    const error = new HttpError("Stok failed, please try again later.", 500);
    return next(error);
  }

  if (!existingStok) {
    newStok = new Stok({
      idPangkalan,
      namaPangkalan,
      photo,
      totalStok,
      gas3Kg,
      gas12Kg,
      brightGas,
    });
  }
  if (existingStok) {
    existingStok.totalStok = totalStok;
    existingStok.gas3Kg = gas3Kg;
    existingStok.gas12Kg = gas12Kg;
    existingStok.brightGas = brightGas;
    newStok = existingStok;
  }

  try {
    await newStok.save();
  } catch (err) {
    const error = new HttpError(
      "Create stok failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ stok: newStok });
};

const updateStok = async (req, res, next) => {
  const { totalStok, gas3Kg, gas12Kg, brightGas } = req.body;

  let idPangkalan = req.params.idPangkalan;

  let stok;
  try {
    stok = await Stok.findById(idPangkalan);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  stok.totalStok = totalStok;
  stok.gas3Kg = gas3Kg;
  stok.gas12Kg = gas12Kg;
  stok.brightGas = brightGas;

  try {
    await stok.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ stok: stok.toObject({ getters: true }) });
};

exports.getAllStok = getAllStok;
exports.getStokById = getStokById;
exports.createStok = createStok;
exports.updateStok = updateStok;
