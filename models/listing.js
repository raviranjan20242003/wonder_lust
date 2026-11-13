
// Mongoose schema describing the fields stored for each accommodation listing.
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,

    // Keep image metadata and its URL together in a nested object.
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1793084879291-ff4a8399fc70?w=600&auto=format&fit=crop&q=60"
        }
    },

    price: Number,
    location: String,
    country: String
});

// Create and export the model used by routes and database initialization.
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
