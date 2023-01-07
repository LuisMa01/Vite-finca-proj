import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import DashHeader from "../../components/DashHeader";

import usePersist from "../../hooks/usePersist";

import "../../styles/login.css";
import EyeImg from "../../images/eye.svg";
import LeafImg from "../../images/leaf.svg";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dash");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  const errClass = errMsg ? "errmsg" : "offscreen"

  if (isLoading) return <p>Loading...</p>;
/*
  const content = (
    <section >
      <header>
        <h1>Login</h1>
      </header>
      <main>
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <button>Sign In</button>

          <label htmlFor="persist">
            <input
              type="checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
            Trust This Device
          </label>
        </form>
      </main>
      
    </section>
  );
  */
  const content = (
    <>
    <DashHeader /> 
      <main className="login-screen">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>
        <form onSubmit={handleSubmit} className="login">
          <h1>Inicie sesión en Finca Experimental AV</h1>
          <img className="bottom-image" src={LeafImg} alt="" />
          <input
            type="text"
            id="username"
            className="login-input"
            placeholder="Nombre de usuario"
            value={username}
            ref={userRef}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />
          <div className="pswd-div">
            <input
              type="password"
              id="password"
              class="login-input password"
              placeholder="Contraseña"
              onChange={handlePwdInput}
              value={password}
              required
            />
            <img
              className="show-password_button"
              src={EyeImg}
              alt="see"
              onClick={seePassword}
            />
          </div>
          <div className="username-error">
            <p ref={errRef} aria-live="assertive" id="error_text">
              {errMsg}
            </p>
          </div>
          <button className="login-submit" type="submit">
            Iniciar sesión
          </button>
          <div className="trust-device">
            <label htmlFor="persist">
              <input
                type="checkbox"
                id="persist"
                onChange={handleToggle}
                checked={persist}
              />
              Confío en este dispositivo
            </label>
          </div>
          <p className="login-text">
            Si olvidó su contraseña, contacte al administrador
          </p>
        </form>
      </main>
    </>
  );

  return content;
};

function seePassword() {
  let myPassword = document.getElementById("password");

  if (myPassword.type === "password") {
    myPassword.type = "text";
  } else {
    myPassword.type = "password";
  }
}

export default Login;
