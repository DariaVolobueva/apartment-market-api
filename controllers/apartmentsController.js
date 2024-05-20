const Apartment = require("../models/Apartment");
const asyncHandler = require("express-async-handler");

// @desc Get all apartments
// @route GET /apartments
const getAllApartments = asyncHandler(async (req, res) => {
    let sort = req.query.sort;
    let filter = +req.query.filter;

    let apartments = "";

    if (sort && filter) {
        apartments = await Apartment.find({ rooms: filter })
            .sort({ price: sort })
            .lean();
        console.log("sort filter");
    } else if (!sort && !filter) {
        apartments = await Apartment.find().lean();
        console.log("!sort !filter");
    } else if (!sort && filter) {
        apartments = await Apartment.find({ rooms: filter }).lean();
        console.log("!sort");
    } else if (sort && !filter) {
        apartments = await Apartment.find().sort({ price: sort }).lean();
        console.log("!filter");
    }

    if (!apartments?.length) {
        return res.status(400).json({ message: "No apartments found" });
    }
    res.json(apartments);
});

// @desc Get an apartments
// @route GET /apartments/{id}

const getAnApartment = asyncHandler(async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "Apartment ID required" });
    }

    const apartment = await Apartment.findOne({ _id: req.params.id }).exec();

    if (!apartment) {
        return res.status(400).json({ message: "Apartment not found" });
    }

    res.json(apartment);
});

// @desc Create new apartment
// @route POST /apartments
const createNewApartment = asyncHandler(async (req, res) => {
    const { rooms, name, price, description } = req.body;

    if (!rooms || !name || !price || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (
        !(typeof rooms === "number") ||
        !(name.length < 100) ||
        !(typeof price === "number") ||
        !(description.length < 1000) ||
        !(rooms > 0) ||
        !(price > 0)
    ) {
        return res.status(400).json({
            message:
                "The submitted fields do not comply with the specified requirements.",
        });
    }

    const duplicate = await Apartment.findOne({ apartmentName: name })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();

    if (duplicate) {
        return res.status(409).json({ message: "Duplicate apartments" });
    }

    const apartmentObject = { rooms, apartmentName: name, price, description };

    const apartment = await Apartment.create(apartmentObject);

    if (apartment) {
        res.status(201).json({ message: `New apartment ${name} created` });
    } else {
        res.status(400).json({ message: "Invalid apartment data received" });
    }
});

// @desc Update an apartment
// @route PUT /apartments/{id}
const updateApartment = asyncHandler(async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "Apartment ID required" });
    }

    const { rooms, name, price, description } = req.body;

    if (!rooms || !name || !price || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (
        !(typeof rooms === "number") ||
        !(name.length < 100) ||
        !(typeof price === "number") ||
        !(description.length < 1000) ||
        !(rooms > 0) ||
        !(price > 0)
    ) {
        return res.status(400).json({
            message:
                "The submitted fields do not comply with the specified requirements.",
        });
    }

    const apartment = await Apartment.findOne({ _id: req.params.id }).exec();

    if (!apartment) {
        return res.status(400).json({ message: "Apartment not found" });
    }

    const duplicate = await Apartment.findOne({
        apartmentName: name,
    })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();

    if (duplicate && duplicate?._id.toString() !== req.params.id) {
        return res.status(409).json({ message: "Duplicate apartments" });
    }

    apartment.rooms = rooms;
    apartment.apartmentName = name;
    apartment.price = price;
    apartment.description = description;

    const updatedApartment = await apartment.save();

    res.json({ message: `${updatedApartment.apartmentName} updated` });
});

// @desc Delete an apartment
// @route DELETE /apartments/{id}
const deleteApartment = asyncHandler(async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "Apartment ID required" });
    }

    const apartment = await Apartment.findOne({ _id: req.params.id }).exec();

    if (!apartment) {
        return res.status(400).json({ message: "Apartment not found" });
    }

    const result = await apartment.deleteOne();

    const reply = `Apartment ${result.apartmentName} with ID ${result._id}`;

    res.json(reply);
});

module.exports = {
    getAllApartments,
    getAnApartment,
    createNewApartment,
    updateApartment,
    deleteApartment,
};
