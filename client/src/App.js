import React, { useState } from "react";
import './App.css';
import axios from 'axios'



function App() {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [data, setData] = useState(null);
  const [qrImage, setqrImage] = useState(null)
  const [tempId, settempId] = useState('')
  const [Token, setToken] = useState('')
  
  const register = () => {
    axios({
      method: "POST",
      data: {
        username: registerUsername,
        password: registerPassword,


      },
      withCredentials: true,
      url: "http://localhost:4000/register",
    })
      .then(res => {



        console.log(res)
        if (res?.data?.success === true) {
          setqrImage(res.data.qr)
        }


      });
  };
  const verify = () => {
    axios({
      method: "POST",
      data: {

        token: Token,
        id: tempId
      },
      withCredentials: true,
      url: "http://localhost:4000/verify",
    })
      .then(res => {
        console.log(res)
        if (res.data.success === true) {
          console.log("user is logged IN successfully ")
        }
      });
  }
  const login = () => {
    axios({
      method: "POST",
      data: {
        username: loginUsername,
        password: loginPassword,

      },
      withCredentials: true,
      url: "http://localhost:4000/login",
    })
      .then(res => {

        if (res.data.success === true) {
          settempId(res.data.id)
        }
      });
  };
  const getUser = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:4000/user",
    }).then((res) => {
      setData(res.data)
      console.log(res.data);

    });
  };


  return (
    <div className="App">

      <div>
        <h1>Register</h1>
        <input placeholder='username' onChange={e => setRegisterUsername(e.target.value)} />
        <input placeholder='password' type="password" onChange={e => setRegisterPassword(e.target.value)} />
        <button onClick={register}>Register</button>

        {
          qrImage && <img src={qrImage} alt="EncodedSecretPNG" width='200px' height='200px' />
        }

      </div>
      {
        tempId ? <div>
          <div>
            <h1>please verify your secret key</h1>
            <input placeholder='6-digit verification code' onChange={e => setToken(e.target.value)} />


            <button onClick={verify}>authenticate</button>
          </div>
        </div> :
          <div>
            <h1>Login</h1>
            <input placeholder='username' onChange={e => setLoginUsername(e.target.value)} />
            <input placeholder='password' type="password" onChange={e => setLoginPassword(e.target.value)} />


            <button onClick={login}>authenticate</button>
          </div>
      }
      <div>
        <h1>Get User</h1>
        <button onClick={getUser}>Submit </button>
        {data ? <h1>Welcome back {data.username}</h1> : null}
      </div>
    </div>);
}

export default App;
