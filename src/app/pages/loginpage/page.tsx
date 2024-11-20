import './style.css';

export default function loginpage() {
    return (
        <div className = "login-page">
            <label className = "Username">Username </label>
            <input type="text" className = "UsernameInput" placeholder="Enter Username"/>
            <label className = "Password">Password </label>
            <input type="text" className = "PasswordInput" placeholder="Enter Password"/>
            <button className = "login-button">Sign In!</button>

        </div>

    );


}