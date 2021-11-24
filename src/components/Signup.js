import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'

function Signup(props) {
    const [credentials, setCredentials] = useState({name: "", email: "", password: "", cpassword: ""})
    let history = useHistory()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        const {name, email, password} = credentials
        const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: name, email: email, password: password}) 
          });
        const json = await response.json()
        console.log(json)

        if(json.success){
            localStorage.setItem('token', json.authToken)
            props.showAlert("Account created successfully","success")
            history.push("/")
        }
        else{
            props.showAlert("Invalid credentials","danger")
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" value={credentials.name} onChange={onChange} id="name" name="name"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" minLength={5} required className="form-control" value={credentials.password} onChange={onChange} id="password" name="password" />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" minLength={5} required className="form-control" value={credentials.cpassword} onChange={onChange} id="cpassword" name="cpassword" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup
