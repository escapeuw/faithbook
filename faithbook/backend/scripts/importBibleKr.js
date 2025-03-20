const fs = require("fs");
const path = require("path");
const sequelize = require("../config/database"); // Adjust the path
const BibleVerseKr = require("../models/BibleVerseKr"); // Adjust the path

// Load the Bible JSON file from /data
const bibleJsonPath = path.join(__dirname, "../data/bible_kr.json"); // Adjusted path
const bibleData = JSON.parse(fs.readFileSync(bibleJsonPath, "utf-8"));

// Function to parse "창1:1" -> { book: "창", chapter: 1, verse: 1 }
const parseReference = (reference) => {
    const match = reference.match(/^([가-힣]+)(\d+):(\d+)$/);
    if (!match) return null; // Skip invalid references
    return {
        book: match[1],       // "창"
        chapter: parseInt(match[2], 10), // 1
        verse: parseInt(match[3], 10)    // 1
    };
};

// Transform JSON into array of objects
const bibleVerses = Object.entries(bibleData).map(([reference, text]) => {
    const parsed = parseReference(reference);
    if (!parsed) return null;
    return {
        book: parsed.book,
        chapter: parsed.chapter,
        verse: parsed.verse,
        text
    };
}).filter(Boolean); // Remove null values if parsing failed

// Insert into database
const insertBibleVerses = async () => {
    try {
        await sequelize.sync(); // Ensure database is connected
        await BibleVerseKr.bulkCreate(bibleVerses);
        console.log("Bible data inserted successfully!");
    } catch (error) {
        console.error("Error inserting Bible data:", error);
    } finally {
        sequelize.close();
    }
};

// Run the function
insertBibleVerses();
