const express = require("express");
const { check } = require("express-validator");

const pesanControllers = require("../controllers/pesan-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", pesanControllers.getAllPesan);

router.get("/pesanan/:idPangkalan", pesanControllers.getPesanan);

router.get("/historyPembeli/:idPembeli", pesanControllers.getHistoryPembeli);

router.get(
  "/historyPangkalan/:idPangkalan",
  pesanControllers.getHistoryPangkalan
);

router.post(
  "/createPesan",
  [
    check("idPangkalan").not().isEmpty(),
    check("idPembeli").not().isEmpty(),
    check("namaPangkalan").not().isEmpty(),
    check("namaPembeli").not().isEmpty(),
    check("photoPembeli").not().isEmpty(),
    check("photoPangkalan").not().isEmpty(),
    check("tanggal").not().isEmpty(),
    check("gas3kg").not().isEmpty(),
    check("gas12Kg").not().isEmpty(),
    check("brightGas").not().isEmpty(),
    check("total").not().isEmpty(),
    check("status").not().isEmpty(),
  ],
  pesanControllers.createPesan
);

router.post(
  "/updateStatus",
  [
    check("idPangkalan").not().isEmpty(),
    check("idPembeli").not().isEmpty(),
    check("status").not().isEmpty(),
  ],
  pesanControllers.updateStatusPesan
);

module.exports = router;
