import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthProvider';
const Login = (props) => {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("123456");
  const [message, setMessage] = useState("");
  const {login} = useContext(AuthContext);
  const handleLogin = async (e) => {
    try{
      let response = await login(email, password);
      props.history.push("/")
    }catch(err){
      setMessage(err.message);
      setEmail("");
      setPassword("");
    }
  }
  return (<>
  <h1>Login page</h1>
    <div>
      <div>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
    </div>
    <button onClick={handleLogin}>Login</button>
    <h2 style={{color: "red"}}> {message}</h2>
  </>);
}

export default Login;