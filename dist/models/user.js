import mongoose from "mongoose";
const schemaDefinition = {
    url: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true,
    },
    clickCount: {
        type: Number,
        required: true,
    },
};
const options = { timestamps: true };
const urlModel = new mongoose.Schema(schemaDefinition, options);
const ShortURL = mongoose.model("ShortURL", urlModel);
export default ShortURL;
