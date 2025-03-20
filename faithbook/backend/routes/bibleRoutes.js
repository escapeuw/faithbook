const express = require("express");
const BibleVerseKr = require("../models/BibleVerseKr");

require("dotenv").config();

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { book, chapter, verse } = req.query;

        if (!book || !chapter || !verse) {
            return res.status(400).json({ error: "Book, chapter, and verse are required." });
        }

        const bibleVerse = await BibleVerseKr.findOne({
            where: { book, chapter, verse }
        });

        if (!bibleVerse) {
            return res.status(404).json({ error: "Verse not found." });
        }

        return res.json(bibleVerse.text);

    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch verses" });
    }
});


module.exports = router;