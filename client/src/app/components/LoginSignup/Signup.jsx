"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/userSlice";

import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";

import "./LoginSignup.css";

const Signup = ({ closeModal }) => {

    const [action, setAction] = useState("Signup");

    const [input, setInput] = useState({
        displayName: '',
        email: '',
        password: ''
    })

    //const [message, setMessage] = useState('Please insert email and password');
    const [message, setMessage] = useState(null);
    const [isValid, setIsValid] = useState(null);

    const [validationErrors, setValidationErrors] = useState({
        displayName: '',
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
        if (input.displayName === '') {
            setValidationErrors(prevValue => {
                return {
                    ...prevValue,
                    displayName: 'name cannot be empty'
                }
            })
            formIsValid = false;
        }

        if (input.email === '') {
            setValidationErrors(prevValue => {
                return {
                    ...prevValue,
                    email: 'email cannot be empty'
                }
            })
            formIsValid = false;
        }

        if (input.password === '') {
            setValidationErrors(prevValue => {
                return {
                    ...prevValue,
                    password: 'password cannot be empty'
                }
            })
            formIsValid = false;
        }

        setIsValid(formIsValid);

        if (formIsValid) {
            //console.log(`Sto inviando i dati ${input.email}, ${input.password}`);
            //setMessage('Logging in...')
            setMessage({ text: 'Signing up...', type: 'info' });

            try {
                const res = await fetch('http://localhost:8000/user', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        displayName: input.displayName,
                        email: input.email,
                        password: input.password
                    })
                });

                console.log(res)

                if (res.ok) {
                    //console.log('Login riuscito!');
                    //dispatch(login(await res.json()));
                    //setMessage(null);
                    setMessage({ text: 'Successfully signed up!', type: 'info' });
                    closeModal(false);
                } else {
                    //setMessage('Errore! Credenziali non valide.');
                    setMessage({ text: 'Registrazione non valida.', type: 'error' });
                }
            } catch (e) {
                //setMessage("Errore! Impossibile trovare il tuo account");
                setMessage({ text: "Errore! Impossibile registrare il tuo account", type: 'error' });
            }
        } else {
            setMessage(null);
        }
    }

    //console.log("input : ", input)
    //console.log("validationErrors : ", validationErrors)


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
                    {<div className="input">
                        <img src={user_icon.src} alt="" />
                        <input type="text" id="displayName" name="displayName" placeholder="Name" onChange={(e) => handleChange(e)} />
                    </div>}
                    {validationErrors.displayName && <div className="error-message">{validationErrors.displayName}</div>}
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
                    {/* <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => { setAction("Sign Up") }}>Sign Up</div> */}
                    <div className="submit"
                        onClick={() => {
                            setAction("Signup")
                            handleSubmit()
                        }}
                    >Signup</div>
                </div>
            </div>
        </div>
    )
}

export default Signup;