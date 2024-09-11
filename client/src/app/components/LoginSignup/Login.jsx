"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/userSlice";
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import "./LoginSignup.css";

const Login = ({ closeModal }) => {

    const [action, setAction] = useState("Login");

    const [input, setInput] = useState({
        email: '',
        password: ''
    })

    //const [message, setMessage] = useState('Please insert email and password');
    const [message, setMessage] = useState(null);
    const [isValid, setIsValid] = useState(null);

    const [validationErrors, setValidationErrors] = useState({
        email: '',
        password: ''
    })



    const handleChange = (e) => {
        const { name, value } = e.target; // utilizza l'assegnazione per destructuring per estrarre due proprietà dall'oggetto e.target: name (l'attributo name del campo di input) e value (il valore corrente inserito dall'utente).
        console.log(`Sto scrivendo ${value} su ${name}`)

        // Gestione facoltativa degli errori di convalida
        setValidationErrors(  // blocco responsabile dell'aggiornamento dello stato degli errori di convalida, riceve lo stato precedente (prevValue) e restituisce un nuovo oggetto di stato.
            prevValue => {
                return {  // Questa blocco crea un nuovo oggetto basato sullo stato precedente "validationErrors"
                    ...prevValue, // Utilizza l'operatore spread (...) per copiare le proprietà esistenti
                    [name]: ''  // imposta dinamicamente il valore per la proprietà corrispondente al nome del campo di input (name) su una stringa vuota ('').
                }             // Questo cancella effettivamente qualsiasi messaggio di errore di convalida esistente per il campo di input specifico con cui l'utente sta interagendo
            }
        )

        // Aggiornamento dello stato dell'input
        setInput(prevValue => { // blocco responsabile dell'aggiornamento dello stato dell'input 
            return {        // Utilizza l'operatore spread (...) per copiare le proprietà esistenti e quindi utilizza la notazione a parentesi quadre ([name])
                ...prevValue, // per impostare dinamicamente il valore per la proprietà corrispondente al nome del campo di input (name) al nuovo valore inserito dall'utente (value).
                [name]: value // Questo aggiorna effettivamente lo stato con l'ultimo valore immesso nel campo di input
            }
        })
    }

    const dispatch = useDispatch();

    const handleSubmit = async () => {

        let formIsValid = true;

        // Validazione del campo "Email"
        if (input.email === '') {
            setValidationErrors(prevValue => ({
                ...prevValue,
                email: 'L\'email non può essere vuota'
            }));
            formIsValid = false;
        } else if (!/\S+@\S+\.\S+/.test(input.email)) {
            setValidationErrors(prevValue => ({
                ...prevValue,
                email: 'Inserisci un\'email valida'
            }));
            formIsValid = false;
        }

        // Validazione del campo "Password"
        if (input.password === '') {
            setValidationErrors(prevValue => ({
                ...prevValue,
                password: 'La password non può essere vuota'
            }));
            formIsValid = false;
        } else if (input.password.length < 6) {
            setValidationErrors(prevValue => ({
                ...prevValue,
                password: 'La password deve essere almeno di 6 caratteri'
            }));
            formIsValid = false;
        }

        setIsValid(formIsValid);

        if (formIsValid) {
            setMessage({ text: 'Logging in...', type: 'info' });

            try {
                const res = await fetch('http://localhost:8000/login', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: input.email,
                        password: input.password
                    })
                });

                if (res.ok) {
                    dispatch(login(await res.json()));
                    setMessage({ text: 'Successfully logged in!', type: 'info' });
                    closeModal(false);
                } else {
                    setMessage({ text: 'Errore! Credenziali non valide.', type: 'error' });
                }
            } catch (e) {
                setMessage({ text: "Errore! Impossibile trovare il tuo account", type: 'error' });
            }
        } else {
            setMessage(null);
        }
    }

    return (
        <div className="modalBackground">
            <div className="containerLogin">
                <div className="titleCloseBtn">
                    <button onClick={() => closeModal(false)}> X </button>
                </div>
                <div className="headerLogin">
                    <div className="text">{action}</div>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <img src={email_icon.src} alt="" />
                        <input type="email" id="email" name="email" placeholder="Email" onChange={(e) => handleChange(e)} />
                    </div>
                    {validationErrors.email && <div className="error-message">{validationErrors.email}</div>}
                    <div className="input">
                        <img src={password_icon.src} alt="" />
                        <input type="password" id="password" name="password" placeholder="Password" onChange={(e) => handleChange(e)} />
                    </div>
                    {validationErrors.password && <div className="error-message">{validationErrors.password}</div>}
                </div>

                {message &&
                    <div className={message.type === "info" ? "message" : "error-message"}>{message.text}</div>
                }

                <div className="submit-container">
                    <div className="submit"
                        onClick={() => {
                            setAction("Login")
                            handleSubmit()
                        }}
                        >Login
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;