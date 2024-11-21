import './style.css';
import Link from 'next/link';


export default function loginpage() {
    return (
        <div>
        <div className = "login-page">
            <label className = "Username">Username </label>
            <input type="text" className = "UsernameInput" placeholder="Enter Username"/>
            <label className = "Password">Password </label>
            <input type="text" className = "PasswordInput" placeholder="Enter Password"/>
            <button className = "login-button">Sign In</button>
            <label className = "register">Don't Have A Restaurant?</label>
            <button className = "register-button">Create Restaurant</button>
        </div>
        <div>
        
        </div>

        <div className = "back-button-login">
            <p>
                <Link href="/" className = "back-button">Back</Link>
            </p>
        </div>
        
        </div>

    );


}