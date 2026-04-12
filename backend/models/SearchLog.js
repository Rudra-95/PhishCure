const mongoose = require("mongoose");

const SearchLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    type: String, // 'url' or 'text'
    value: String,
    score: Number,
    verdict: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SearchLog", SearchLogSchema);
