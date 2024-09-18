// components/Avatar.jsx
import React from 'react';

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

const AvatarV2 = ({ user }) => {
    console.log("USER --> ", user)
    const { name, email } = user;
    const initials = getInitials(name, email); // Calcola le iniziali
    const avatarKey = name || email; // Usiamo name o email come base per il colore
    const backgroundColor = stringToColor(avatarKey); // Colore basato su name o email
    const textColor = backgroundColor > '#888888' ? 'black' : 'white'; // Se il colore è chiaro, usa testo nero

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

export default AvatarV2;
