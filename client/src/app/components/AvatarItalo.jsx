import React from 'react';

const Avatar = ({ displayName }) => {
    // Funzione per ottenere le iniziali dal displayName
    const getInitials = (name) => {
        const nameArray = name.split(' ');
        let initials = nameArray[0][0].toUpperCase(); // Prima lettera del primo nome

        if (nameArray.length > 1) {
            initials += nameArray[1][0].toUpperCase(); // Prima lettera del cognome (se disponibile)
        }
        return initials;
    };

    // Funzione per generare un colore random
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

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

    const backgroundColor = getRandomColor(); // Colore di sfondo casuale
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
            <span className="initials">{getInitials(displayName)}</span>
        </div>
    );
};

export default Avatar;
