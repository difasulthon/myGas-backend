const express = require("express");
const { check } = require("express-validator");

const stokControllers = require("../controllers/stok-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", stokControllers.getAllStok);

router.get("/:idPangkalan", stokControllers.getStokById);

router.post(
  "/createStok",
  [
    check("idPangkalan").not().isEmpty(),
    check("namaPangkalan").not().isEmpty(),
    check("photo").not().isEmpty(),
    check("totalStok").not().isEmpty(),
    check("gas3kg").not().isEmpty(),
    check("gas12Kg").not().isEmpty(),
    check("brightGas").not().isEmpty(),
  ],
  stokControllers.createStok
);

router.patch(
  "/:idPangkalan",
  [
    check("totalStok").not().isEmpty(),
    check("gas3Kg").not().isEmpty(),
    check("gas12Kg").not().isEmpty(),
    check("brightGas").not().isEmpty(),
  ],
  stokControllers.updateStok
);

module.exports = router;
