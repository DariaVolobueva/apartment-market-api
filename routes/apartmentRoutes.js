const express = require("express");
const router = express.Router();
const apartmentsController = require("../controllers/apartmentsController");

router
    .route("/")
    .get(apartmentsController.getAllApartments)
    .post(apartmentsController.createNewApartment);

router
    .route("/:id")
    .get(apartmentsController.getAnApartment)
    .put(apartmentsController.updateApartment)
    .delete(apartmentsController.deleteApartment);

module.exports = router;
