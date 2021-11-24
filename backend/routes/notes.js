const express = require("express")
const router = express.Router()
var fetchUser = require('../middleware/fetchUser')
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

//Route 1: Get all the Notes using: GET "/api/auth/getuser". Login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
    try {   
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }
})

//Route 2: Add a new note using: POST "/api/auth/addnote". Login required
router.post("/addnote", fetchUser, [
    body('title', 'Enter a valid name').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    try {

        const { title, description, tag } = req.body;
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title,
            description,
            tag,
            user: req.user.id,
        })

        const saveNote = await note.save()
        res.json(saveNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }
})

//Route 3: Update note using: PUT "/api/auth/updatenote". Login required
router.put("/updatenote/:id", fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        //Create new note
        const newNote = {}
        if(title){newNote.title = title}
        if(description){newNote.description = description}
        if(tag){newNote.tag = tag}

        //Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not found!")}
        if(note.user.toString() !== req.user.id){return res.status(401).send("Unauthorized!")}

        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }
})

//Route 4: Delete note using: DELETE "/api/auth/deletenote". Login required
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
    try {
        //Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not found!")}
        if(note.user.toString() !== req.user.id){return res.status(401).send("Unauthorized!")}

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Sucess": "Note has been deleted!", note: note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }
})

module.exports = router