import React, { Component } from 'react'
import axios from 'axios'

class Register extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
            errors: {}
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    async onSubmit(e) {
        try {
            e.preventDefault();
            const newUser = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                password2: this.state.password2
            }
            const res = await axios.post('/api/users/register', newUser);
            console.log(res.data);
        } catch (err) {
            this.setState({ errors: err.response.data })
        }

    }
    render() {
        const { errors } = this.state
        return (
            <div className="register">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Sign Up</h1>
                            <p className="lead text-center">Create your DevConnector account</p>
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <input type="text"
                                        className={`form-control form-control-lg ${errors.name && "is-invalid"}`}
                                        placeholder="Name"
                                        onChange={this.onChange}
                                        value={this.state.name} name="name" />
                                    {errors.name && <><div className="invalid-feedback">{errors.name}</div></>}
                                </div>
                                <div className="form-group">
                                    <input type="email"
                                        className={`form-control form-control-lg ${errors.email && "is-invalid"}`}
                                        placeholder="Email Address"
                                        onChange={this.onChange}
                                        value={this.state.email}
                                        name="email" />
                                    {errors.email && <><div className="invalid-feedback">{errors.email}</div></>}
                                    <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                                </div>
                                <div className="form-group">
                                    <input type="password"
                                        className={`form-control form-control-lg ${errors.password && "is-invalid"}`}
                                        placeholder="Password"
                                        onChange={this.onChange}
                                        value={this.state.password}
                                        name="password" />
                                    {errors.password && <><div className="invalid-feedback">{errors.password}</div></>}
                                </div>
                                <div className="form-group">
                                    <input type="password"
                                        className={`form-control form-control-lg ${errors.password2 && "is-invalid"}`}
                                        placeholder="Confirm Password"
                                        onChange={this.onChange}
                                        value={this.state.password2}
                                        name="password2" />
                                    {errors.password2 && <><div className="invalid-feedback">{errors.password2}</div></>}
                                </div>
                                <input type="submit" className="btn btn-info btn-block mt-4" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Register
