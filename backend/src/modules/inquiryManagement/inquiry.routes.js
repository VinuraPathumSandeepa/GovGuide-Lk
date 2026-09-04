const express = require("express");

const {
    createInquiry,
    getInquiries,
    getInquiryById,
    updateInquiryStatus,
    deleteInquiry,
} = require(
    "./inquiry.controller"
);

const router =
    express.Router();


router.get(
    "/",
    getInquiries
);


router.get(
    "/:id",
    getInquiryById
);


router.post(
    "/",
    createInquiry
);


router.patch(
    "/:id/status",
    updateInquiryStatus
);


router.delete(
    "/:id",
    deleteInquiry
);



module.exports = router;