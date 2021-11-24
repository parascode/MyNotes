import React, { useContext, useState }  from 'react'
import NoteContext from '../context/notes/NoteContext'

export default function AddNote(props) {
    const context = useContext(NoteContext)
    const {addNote} = context;

    const [note, setNote] = useState({title: "", desc: "", tag: ""})
    const handleClick = (e)=>{
        e.preventDefault();
        addNote(note.title, note.desc, note.tag)
        setNote({title: "", desc: "", tag: ""})
        props.showAlert("Added Successfully", "success")
    }

    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }

    return (
        <div className="container my-3">
            <h1>Add a Note</h1>
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" minLength={5} required className="form-control" id="title" value={note.title} name="title" onChange = {onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="desc" className="form-label">Description</label>
                    <input type="text" minLength={5} required className="form-control" id="desc" value={note.desc} name="desc" onChange = {onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange = {onChange}/>
                </div>
                <button disabled={note.title.length<5 || note.desc.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
        </div>
    )
}
