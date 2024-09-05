"use client"
import { useState, useEffect } from "react"
import styles from "../login.module.css";
import { login } from "../store/userSlice";
import { useDispatch } from "react-redux";


const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: ''
  })
  const [message, setMessage] = useState('Please insert email and password');
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

  useEffect(() => {
    if (isValid) {
      console.log(`Sto inviandoi dati ${input.email}, ${input.password}`)
      setMessage('Logging in...')
      fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: input.email,
          password: input.password
        })
      }).then(async res => {
        console.log(`Login riuscito!`)
        dispatch(login(await res.json()));
      }).catch(e => {
        setMessage("Errore");
      })
    }
  }, [isValid]);

  const handleSubmit = () => {

    if (input.email === '') {
      setValidationErrors(prevValue => {
        return {
          ...prevValue,
          email: 'email cannot be empty'
        }
      })
      setIsValid(false);
    }

    if (input.password === '') {
      setValidationErrors(prevValue => {
        return {
          ...prevValue,
          password: 'password cannot be empty'
        }
      })
      setIsValid(false);
    }

    console.log(`Ho cliccato login e i dati sono validi`);
    setIsValid(true);
  }

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <input
          className={styles.input}
          id='email'
          type={'text'}
          name={'email'}
          value={input.email}
          onChange={(e) => handleChange(e)}
          placeholder='Email'
        />
        <input
          className={styles.input}
          id='password'
          type={'password'}
          name={'password'}
          value={input.password}
          onChange={(e) => handleChange(e)}
          placeholder='Password'
        />
      </form>
      {Object.values(validationErrors).map((err, index) => {
        return <div className={styles.error} key={index}>{err}</div>
      })}
      <div> {message} </div>
      <button className={styles.button} onClick={() => handleSubmit()}> login </button>
    </div>
  )
}
export default Login;