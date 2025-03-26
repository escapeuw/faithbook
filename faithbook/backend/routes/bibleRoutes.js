const express = require("express");
const { Op } = require("sequelize");
const BibleVerseKr = require("../models/BibleVerseKr");

require("dotenv").config();

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { book, chapter, verse, endChapter, endVerse } = req.query;

        if (!book || !chapter || !verse) {
            return res.status(400).json({ error: "Book, chapter, and verse are required." });
        }

        // Check if the difference between start and end chapter is greater than 1
        if (endChapter && Math.abs(parseInt(endChapter) - parseInt(chapter)) > 1) {
            return res.status(400).json({ error: "The chapter range cannot exceed a difference of 1 chapter." });
        }

        let whereCondition = {
            book,
            chapter,
            verse: { [Op.gte]: verse } // Start from the given verse
        };

        // If endChapter and endVerse are not provided, fetch a single verse
        if (!endChapter && !endVerse) {
            whereCondition.verse = verse;
        } else if (endChapter && endVerse) {
            // If endChapter is the same as start chapter, fetch verses within the chapter
            if (endChapter == chapter) {
                whereCondition.verse = { [Op.between]: [verse, endVerse] };
            } else {
                // Fetch across multiple chapters (with chapter range restriction)
                whereCondition = {
                    book,
                    [Op.or]: [
                        {
                            chapter,
                            verse: { [Op.gte]: verse } // First chapter: start from given verse
                        },
                        {
                            chapter: { [Op.gt]: chapter, [Op.lt]: endChapter } // Full chapters in between
                        },
                        {
                            chapter: endChapter,
                            verse: { [Op.lte]: endVerse } // Last chapter: up to given verse
                        }
                    ]
                };
            }
        }

        const bibleVerses = await BibleVerseKr.findAll({
            where: whereCondition,
            order: [["chapter", "ASC"], ["verse", "ASC"]],
        });

        if (!bibleVerses.length) {
            return res.status(404).json({ error: "Verse(s) not found." });
        }

        // Build the verseTitle
        const verseTitle = `${book} ${chapter}:${verse}` + (endChapter ? ` - ${endChapter}:${endVerse}` : "");

        // Return both bibleVerses and verseTitle
        return res.json({
            verseTitle,
            bibleVerses
        });

    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch verses" });
    }
});



module.exports = router;