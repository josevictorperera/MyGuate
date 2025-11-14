// tools/add_ids.mjs
// Run using: node tools/add_ids.mjs
// Finds the highest existing ID and assigns the next sequential 4-digit ID
// to any product missing one.

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const dir = "_products";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".md"));

let maxId = 999; // Start the sequence so the first ID will be 1000 (four digits)

// 1. First Pass: Find the highest existing ID (including the 9-digit ones)
files.forEach(file => {
    const full = path.join(dir, file);
    const raw = fs.readFileSync(full, "utf8");
    const parsed = matter(raw);
    const data = parsed.data;

    // Check for existing ID keys (ID or id)
    const existingId = data.ID || data.id;

    if (typeof existingId === 'number') {
        if (existingId > maxId) {
            maxId = existingId;
        }
    }
});

console.log(`\nStarting ID generation from: ${maxId + 1}`);
console.log("------------------------------------------");

// 2. Second Pass: Add the next sequential ID to missing files
files.forEach(file => {
    const full = path.join(dir, file);
    const raw = fs.readFileSync(full, "utf8");
    const parsed = matter(raw);
    const data = parsed.data;

    // Check if ID is present and is a number (your previous successful condition)
    if (typeof data.ID === 'number' || typeof data.id === 'number') {
        console.log(`✔ Already has ID → ${file}`);
        return;
    }

    // Assign the next sequential ID
    maxId++;
    const newId = maxId;

    // Ensure it's a 4-digit number (or more if your count exceeds 9999)
    if (newId < 1000) {
        // If somehow maxId was reset below 1000, start at 1000
        data.ID = 1000;
        maxId = 1000;
    } else {
        data.ID = newId; // assign the new sequential ID
    }

    const out = matter.stringify(parsed.content, data);

    fs.writeFileSync(full, out);
    console.log(`➕ Added NEW ID ${data.ID} → ${file}`);
});