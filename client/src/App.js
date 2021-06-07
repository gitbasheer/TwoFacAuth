import React, { useState } from "react";
import './App.css';
import axios from 'axios'



function App() {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // const [loginToken, setLoginToken] = useState("");
  const [data, setData] = useState(null);
  // const qrimg = req.body.qr;
  const [qrImage, setqrImage] = useState(null)
  const [qrcreated, useqr] = useState("");
  const [tempId, settempId] = useState('')
const [Token, setToken] = useState('')
  const register = () => {
    axios({
      method: "POST",
      data: {
        username: registerUsername,
        password: registerPassword,
        qr: qrcreated,

      },
      withCredentials: true,
      url: "http://localhost:4000/register",
    })
      .then(res =>{
        
        
        
        console.log(res)
      if(res?.data?.success==true){
        setqrImage(res.data.qr)
      }
      
      
      });
  };
  const verify=()=>{
    axios({
      method: "POST",
      data: {
       
        token: Token,
        id:tempId
      },
      withCredentials: true,
      url: "http://localhost:4000/verify",
    })
      .then(res =>{
console.log(res)
        if(res.data.success==true){
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
        //token: loginToken
      },
      withCredentials: true,
      url: "http://localhost:4000/login",
    })
      .then(res =>{

        if(res.data.success==true){
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

  /*
    const disQR = () => {
      return (
        <div className="App">
          <img src="data:image/png;base64,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" alt="" >
          </img>
        </div>
  
      );
    }
  */
  return (
    <div className="App">

      <div>
        <h1>Register</h1>
        <input placeholder='username' onChange={e => setRegisterUsername(e.target.value)} />
        <input placeholder='password' type="password" onChange={e => setRegisterPassword(e.target.value)} />
        <button onClick={register}>Register</button>

        {
          qrImage && <img src={qrImage} width='100px' height='100px' />
        }

      </div>
{
  tempId ?<div>
<div>
        <h1>Verify Token</h1>
        <input placeholder='username' onChange={e => setToken(e.target.value)} />


        <button onClick={verify}>authenticate</button>
      </div>
  </div>:
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
