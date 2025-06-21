import React, { useState } from 'react';
import styled from 'styled-components';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const auth = getAuth();
    if (isLogin) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('¡Sesión iniciada correctamente!');
        onAuthSuccess();
      } catch (err) {
        setError('Email o contraseña incorrectos, o la cuenta solo existe con Google.');
      } finally {
        setLoading(false);
      }
    } else {
      // Registro
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          firstName,
          lastName,
          email,
          createdAt: new Date().toISOString()
        });
        setMessage('¡Cuenta creada correctamente!');
        setIsLogin(true);
      } catch (err: any) {
        setError(err.message || 'No se pudo crear la cuenta.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');
    if (!email) {
      setError('Introduce tu email para recuperar la contraseña.');
      return;
    }
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setMessage('Se ha enviado un email para restablecer la contraseña.');
    } catch (err) {
      setError('No se pudo enviar el email. ¿Seguro que el correo es correcto?');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setMessage('¡Sesión iniciada con Google!');
      onAuthSuccess();
    } catch (err) {
      setError('No se pudo iniciar sesión con Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleAuth}>
        {!isLogin && (
          <>
            <div className="flex-column">
              <label>Nombre</label>
            </div>
            <div className="inputForm">
              <input placeholder="Introduce tu nombre" className="input" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div className="flex-column">
              <label>Apellidos</label>
            </div>
            <div className="inputForm">
              <input placeholder="Introduce tus apellidos" className="input" type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </>
        )}
        <div className="flex-column">
          <label>Correo electrónico</label></div>
        <div className="inputForm">
          <svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="0 0 32 32" height={20}><g data-name="Layer 3" id="Layer_3"><path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" /></g></svg>
          <input placeholder="Introduce tu correo electrónico" className="input" type="text" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="flex-column">
          <label>Contraseña</label></div>
        <div className="inputForm">
          <svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="-64 0 512 512" height={20}><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" /><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" /></svg>        
          <input placeholder="Introduce tu contraseña" className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="flex-row">
          <div>
            <input type="radio" />
            <label>Recuérdame</label>
          </div>
          <span className="span" onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>
            ¿Olvidaste tu contraseña?
          </span>
        </div>
        <button className="button-submit" type="submit" disabled={loading}>{isLogin ? 'Iniciar sesión' : 'Registrarse'}</button>
        {message && <div style={{ color: 'green', textAlign: 'center' }}>{message}</div>}
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        <p className="p">
          {isLogin ? (
            <>
              ¿No tienes cuenta? <span className="span" onClick={() => setIsLogin(false)}>Regístrate</span>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta? <span className="span" onClick={() => setIsLogin(true)}>Inicia sesión</span>
            </>
          )}
        </p>
        <p className="p line">O inicia sesión con</p>
        <div className="flex-row">
          <button className="btn google" type="button" onClick={handleGoogleSignIn} disabled={loading}>
            <svg xmlSpace="preserve" viewBox="0 0 512 512" y="0px" x="0px" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" id="Layer_1" width={20} version="1.1">
              <path d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
        	  c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
        	  C103.821,274.792,107.225,292.797,113.47,309.408z" style={{fill: '#FBBB00'}} />
              <path d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
        	  c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
        	  c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z" style={{fill: '#518EF8'}} />
              <path d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
        	  c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
        	  c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z" style={{fill: '#28B446'}} />
              <path d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
        	  c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
        	  C318.115,0,375.068,22.126,419.404,58.936z" style={{fill: '#F14336'}} />
            </svg>
            Google 
          </button>
        </div>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 100%;
    max-width: 450px;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    border: 1.5px solid #e5e7eb;
    box-shadow: 0 2px 16px 0 rgba(0,0,0,0.04);
    margin: 16px;
  }

  ::placeholder {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .form button {
    align-self: flex-end;
  }

  .flex-column > label {
    color: #151717;
    font-weight: 600;
  }

  .inputForm {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    transition: 0.2s ease-in-out;
  }

  .input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 100%;
    height: 100%;
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #2d79f3;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }

  .flex-row > div > label {
    font-size: 14px;
    color: black;
    font-weight: 400;
  }

  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: #151717;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
  }

  .p {
    text-align: center;
    color: black;
    font-size: 14px;
    margin: 5px 0;
  }

  .btn {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    border: 1px solid #ededef;
    background-color: white;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .btn:hover {
    border: 1px solid #2d79f3;
    ;
  }

  .flex-row > div > input[type='radio'] {
    margin-right: 6px;
  }
`;

export default Auth; 