import React, { Component } from 'react'

class Register extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
            error: {}
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    onSubmit(e) {
        e.preventDefault();
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        }
        console.log(newUser)

    }
    render() {
        return (
            <div className="register">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Sign Up</h1>
                            <p className="lead text-center">Create your DevConnector account</p>
                            <form action="create-profile.html" onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <input type="text"
                                        className="form-control form-control-lg"
                                        placeholder="Name"
                                        onChange={this.onChange}
                                        value={this.state.name} name="name" />
                                </div>
                                <div className="form-group">
                                    <input type="email"
                                        className="form-control form-control-lg"
                                        placeholder="Email Address"
                                        onChange={this.onChange}
                                        value={this.state.email}
                                        name="email" />
                                    <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                                </div>
                                <div className="form-group">
                                    <input type="password"
                                        className="form-control form-control-lg"
                                        placeholder="Password"
                                        onChange={this.onChange}
                                        value={this.state.password}
                                        name="password" />
                                </div>
                                <div className="form-group">
                                    <input type="password"
                                        className="form-control form-control-lg"
                                        placeholder="Confirm Password"
                                        onChange={this.onChange}
                                        value={this.state.password2}
                                        name="password2" />
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
