import './style.css';

export default function loginpage() {
    return (
        <div className = "login-page">
            <label className = "UserName">Username </label>
            <input type="text" className = "UsernameInput" placeholder="Type something..."/>
        </div>
    );


}