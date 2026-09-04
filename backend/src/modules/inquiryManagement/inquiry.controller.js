const Inquiry = require("./inquiry.model");


// ======================================
// GENERATE REFERENCE NUMBER
// ======================================

const generateReferenceNumber = () => {
    const date = new Date();

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    const randomNumber =
        Math.floor(
            1000 + Math.random() * 9000
        );

    return `INQ-${year}${month}${day}-${randomNumber}`;
};


// ======================================
// CREATE INQUIRY
// ======================================

const createInquiry = async (
    req,
    res
) => {
    try {
        const {
            fullName,
            email,
            phone,
            district,
            serviceCategory,
            subject,
            message,
        } = req.body;


        if (
            !fullName ||
            !email ||
            !phone ||
            !district ||
            !serviceCategory ||
            !subject ||
            !message
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please complete all required inquiry fields.",
            });
        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(email)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid email address.",
            });
        }


        let referenceNumber =
            generateReferenceNumber();


        let existingReference =
            await Inquiry.findOne({
                referenceNumber,
            });


        while (existingReference) {
            referenceNumber =
                generateReferenceNumber();

            existingReference =
                await Inquiry.findOne({
                    referenceNumber,
                });
        }


        const inquiry =
            await Inquiry.create({
                referenceNumber,
                fullName,
                email,
                phone,
                district,
                serviceCategory,
                subject,
                message,
                status: "Pending",
            });


        res.status(201).json({
            success: true,
            message:
                "Your inquiry was submitted successfully.",
            referenceNumber:
                inquiry.referenceNumber,
            data: inquiry,
        });
    } catch (error) {
        console.error(
            "Create Inquiry Error:",
            error
        );


        if (
            error.name ===
            "ValidationError"
        ) {
            const messages =
                Object.values(
                    error.errors
                ).map(
                    (item) =>
                        item.message
                );


            return res
                .status(400)
                .json({
                    success: false,
                    message:
                        messages[0],
                });
        }


        res.status(500).json({
            success: false,
            message:
                "Unable to submit the inquiry. Please try again.",
        });
    }
};


// ======================================
// GET ALL INQUIRIES
// ======================================

const getInquiries = async (
    req,
    res
) => {
    try {
        const {
            search,
            status,
        } = req.query;


        const filter = {};


        if (search) {
            filter.$or = [
                {
                    referenceNumber: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    fullName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    subject: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    serviceCategory: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }


        if (
            status &&
            status !== "All"
        ) {
            filter.status = status;
        }


        const inquiries =
            await Inquiry.find(
                filter
            ).sort({
                createdAt: -1,
            });


        res.status(200).json({
            success: true,
            count:
                inquiries.length,
            data: inquiries,
        });
    } catch (error) {
        console.error(
            "Get Inquiries Error:",
            error
        );


        res.status(500).json({
            success: false,
            message:
                "Unable to load inquiries.",
        });
    }
};


// ======================================
// GET SINGLE INQUIRY
// ======================================

const getInquiryById =
    async (req, res) => {
        try {
            const inquiry =
                await Inquiry.findById(
                    req.params.id
                );


            if (!inquiry) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Inquiry not found.",
                    });
            }


            res.status(200).json({
                success: true,
                data: inquiry,
            });
        } catch (error) {
            console.error(
                "Get Inquiry Error:",
                error
            );


            res.status(500).json({
                success: false,
                message:
                    "Unable to load the inquiry.",
            });
        }
    };


// ======================================
// UPDATE INQUIRY STATUS
// ======================================

const updateInquiryStatus =
    async (req, res) => {
        try {
            const {
                status,
                response,
            } = req.body;


            const allowedStatuses = [
                "Pending",
                "In Progress",
                "Resolved",
            ];


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Please select a valid inquiry status.",
                    });
            }


            const inquiry =
                await Inquiry.findById(
                    req.params.id
                );


            if (!inquiry) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Inquiry not found.",
                    });
            }


            inquiry.status =
                status;


            if (
                response !== undefined
            ) {
                inquiry.response =
                    response;
            }


            await inquiry.save();


            res.status(200).json({
                success: true,
                message:
                    "Inquiry status updated successfully.",
                data: inquiry,
            });
        } catch (error) {
            console.error(
                "Update Inquiry Status Error:",
                error
            );


            res.status(500).json({
                success: false,
                message:
                    "Unable to update inquiry status.",
            });
        }
    };


// ======================================
// DELETE INQUIRY
// ======================================

const deleteInquiry =
    async (req, res) => {
        try {
            const inquiry =
                await Inquiry.findById(
                    req.params.id
                );


            if (!inquiry) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Inquiry not found.",
                    });
            }


            await inquiry.deleteOne();


            res.status(200).json({
                success: true,
                message:
                    "Inquiry deleted successfully.",
            });
        } catch (error) {
            console.error(
                "Delete Inquiry Error:",
                error
            );


            res.status(500).json({
                success: false,
                message:
                    "Unable to delete the inquiry.",
            });
        }
    };


module.exports = {
    createInquiry,
    getInquiries,
    getInquiryById,
    updateInquiryStatus,
    deleteInquiry,
};