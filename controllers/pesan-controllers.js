const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const Pesan = require("../models/pesan");
const Stok = require("../models/stok");
const getMonthName = require("../utils/getMonth");

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const getAllPesan = async (req, res, next) => {
  let pesan;
  try {
    pesan = await Pesan.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching stok failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ pesan: pesan.map((pesan) => pesan.toObject({ getters: true })) });
};

const createPesan = async (req, res, next) => {
  const {
    idPangkalan,
    idPembeli,
    namaPangkalan,
    namaPembeli,
    photoPembeli,
    photoPangkalan,
    gas3Kg,
    gas12Kg,
    brightGas,
    total,
    status,
  } = req.body;

  let today = new Date();
  let d = today.getDate();
  let m = today.getMonth();
  let month = monthNames[m];
  let y = today.getFullYear();
  let date = `${d} ${month} ${y}`;

  let pesanan;
  let existingPesanan;
  try {
    existingPesanan = await Pesan.findOne({
      idPangkalan: idPangkalan,
      idPembeli: idPembeli,
    });
  } catch (err) {
    const error = new HttpError("Stok failed, please try again later.", 500);
    return next(error);
  }

  console.log(existingPesanan);

  if (!existingPesanan) {
    pesanan = new Pesan({
      idPangkalan,
      idPembeli,
      namaPangkalan,
      namaPembeli,
      photoPembeli,
      photoPangkalan,
      tanggal: date,
      gas3Kg,
      gas12Kg,
      brightGas,
      total,
      status,
    });
  }
  if (existingPesanan) {
    existingPesanan.total = total;
    existingPesanan.gas3Kg = gas3Kg;
    existingPesanan.gas12Kg = gas12Kg;
    existingPesanan.brightGas = brightGas;
    existingPesanan.status = status;
    pesanan = existingPesanan;
  }

  try {
    await pesanan.save();
  } catch (err) {
    const error = new HttpError(
      "Create pesan failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ pesan: pesanan });
};

const getPesanan = async (req, res, next) => {
  let idPangkalan = req.params.idPangkalan;

  let pesan;
  try {
    pesan = await Pesan.find({
      idPangkalan: `${idPangkalan}`,
      status: "PESAN",
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find an order.",
      500
    );
    return next(error);
  }

  if (!pesan) {
    const error = new HttpError(
      "Could not find stok for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ pesan: pesan });
};

const getHistoryPembeli = async (req, res, next) => {
  let idPembeli = req.params.idPembeli;

  let pesan;
  try {
    pesan = await Pesan.find({ idPembeli: `${idPembeli}`, status: "TERIMA" });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a history.",
      500
    );
    return next(error);
  }

  if (!pesan) {
    const error = new HttpError(
      "Could not find stok for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ pesan: pesan });
};

const getHistoryPangkalan = async (req, res, next) => {
  let idPangkalan = req.params.idPangkalan;

  let pesan;
  try {
    pesan = await Pesan.find({
      idPangkalan: `${idPangkalan}`,
      status: "TERIMA",
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a history.",
      500
    );
    return next(error);
  }

  if (!pesan) {
    const error = new HttpError(
      "Could not find stok for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ pesan: pesan });
};

const updateStatusPesan = async (req, res, next) => {
  const { idPangkalan, idPembeli, status } = req.body;

  let pesan;
  try {
    pesan = await Pesan.findOne({
      idPangkalan: `${idPangkalan}`,
      idPembeli: `${idPembeli}`,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a pesanan.",
      500
    );
    return next(error);
  }

  let stok;
  try {
    stok = await Pesan.findOne({
      idPangkalan: `${idPangkalan}`,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a stok.",
      500
    );
    return next(error);
  }

  let today = new Date();
  let d = today.getDate();
  let m = today.getMonth();
  let month = monthNames[m];
  let y = today.getFullYear();
  let date = `${d} ${month} ${y}`;

  if (stok) {
    if (status === "TERIMA") {
      stok.totalStok = stok.totalStok - pesan.total;
      stok.gas3kg = stok.gas3Kg - pesan.gas3Kg;
      stok.gas12Kg = stok.gas12Kg - pesan.gas12Kg;
      stok.brightGas = stok.brightGas - pesan.brightGas;
      stok.save();
    }
  }

  pesan.tanggal = date;
  pesan.status = status;

  try {
    await pesan.save();
  } catch (err) {
    const error = new HttpError(
      "Create pesan failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ pesan: pesan });
};

exports.getAllPesan = getAllPesan;
exports.createPesan = createPesan;
exports.getPesanan = getPesanan;
exports.getHistoryPembeli = getHistoryPembeli;
exports.getHistoryPangkalan = getHistoryPangkalan;
exports.updateStatusPesan = updateStatusPesan;
