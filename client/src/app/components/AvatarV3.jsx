// components/Avatar.jsx
import React from 'react';

// Funzione per calcolare la luminosità di un colore esadecimale
const getTextColor = (backgroundColor) => {
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);

    // Formula per calcolare la luminosità percepita
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Se la luminosità è sopra un certo valore, usa testo nero, altrimenti bianco
    return brightness > 128 ? 'black' : 'white';
};

// Funzione per generare un colore unico basato su un valore di input (es: displayName o email)
const stringToColor = (inputString) => {
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
        hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).slice(-2);
    }
    return color;
};

// Funzione per ottenere le iniziali dal name o dall'email
const getInitials = (name, email) => {
    if (name) {
        const nameArray = name.split(' ');
        let initials = nameArray[0][0].toUpperCase();
        if (nameArray.length > 1) {
            initials += nameArray[1][0].toUpperCase(); // Prima lettera del cognome o della seconda parola
        } else if (nameArray.length === 1 && name.length > 1) {
            initials += nameArray[0][1].toUpperCase(); // Prende la seconda lettera se esiste
        }
        return initials;
    } else if (email) {
        return email.slice(0, 2).toUpperCase(); // Prende le prime due lettere dell'email
    }
    return 'NN'; // Se non c'è nulla, ritorna 'NN' per "No Name"
};

const AvatarV3 = ({ user }) => {
    const { name, email } = user;
    const initials = getInitials(name, email); // Calcola le iniziali
    const avatarKey = name || email; // Usiamo name o email come base per il colore
    const backgroundColor = stringToColor(avatarKey); // Colore basato su name o email
    const textColor = getTextColor(backgroundColor); // Colore del testo basato sulla luminosità

    return (
        <div
            className="avatar-circle"
            style={{
                backgroundColor: backgroundColor,
                color: textColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                fontWeight: 'bold',
                fontSize: '1rem'
            }}
        >
            <span className="initials">{initials}</span>
        </div>
    );
};

export default AvatarV3;
