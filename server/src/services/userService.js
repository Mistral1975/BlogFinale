import userRepository from "../repository/userRepository.js";
import cryptoUtils from "../utils/cryptoUtils.js";
import mailer from 'nodemailer';
import UnauthorizedException from "../exceptions/unauthorizedException.js";

const register = async (content) => {
    const {password, salt} = cryptoUtils.hashPassword(content.password);
    content.password = password;
    content.salt = salt;
    content.status = 'pending';
    content.registrationToken = cryptoUtils.generateUniqueCode(10);
    //console.log("CONTENT ->>> ", content)
    const result = await userRepository.add(content);
    
    //console.log("RESULT ->>> ", result)
    await sendRegistrationMail(content.email, buildRegistrationLink(result._id, content.registrationToken));
    return result;
}

const buildRegistrationLink = (id, token) => {
    return `http://localhost:8000/user/${id}/confirm/${encodeURIComponent(token)}`;
}

const sendRegistrationMail = async(email, link) => {
    const senderAddress = 'mistralsup75@gmail.com'; // mistralsup75@gmail.com / mistralsup75@outlook.it
    const subject = 'BlogTNV: Conferma registrazione';
    const body = `Benvenuto su BlogTNV

            Attiva il tuo account cliccando qui! ${link}

            Leggi questi punti per capire quanto sia facile BuyOn:
            - Scegli uno dei tantissimi negozi presenti su BuyOn.
            - Clicca e compra direttamente sul sito del negozio scelto.
            - Ritorna sulla finestra di BuyOn per confermare l'acquisto.
            - Appena il negozio accetterà l'ordine ti accrediteremo il cashback.
            - Raggiunti almeno 50€ indicaci la tua banca e incassa i soldi.

            Il Team BlogTNV `;
    /* const transport = {
        host: 'smtp.elasticemail.com', // smtp.google.com / smtp.office365.com
        port: 2525, // 465, 587, 25
        secure: false, // secure for 465, false for other port
        auth: {
            user: senderAddress,
            pass: '8035AF9563D298C9DB72C1BFCD6457FA8319', // yhndqshdoqslvisf
        },
    }; */
    const transport = {
        host: 'smtp.elasticemail.com', // smtp.google.com / smtp.office365.com
        port: 2525, // 465, 587, 25
        secure: false, // secure for 465, false for other port
        auth: {
            user: senderAddress,
            pass: '8035AF9563D298C9DB72C1BFCD6457FA8319', // yhndqshdoqslvisf
        },
    };
    const mailData = {
        from: `BlogTNV servizio di registrazione <${senderAddress}>`,
        subject: subject,
        text: body,
        to: email,
        html: `<table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td style="font-family:Montserrat,Arial,sans-serif; font-weight:400; font-size:14px; color:#666666;">
                <b>Benvenuto su BlogTNV</b>
                <br><br>
                Per completare la registrazione ti preghiamo di confermare la tua iscrizione cliccando sul link qui sotto:
                <br><br>
                <a href="${link}" target="_blank" style="color:#337AB7; text-decoration:none;"><b>Attiva il tuo account!</b></a>
                <br><br>
                **** Il collegamento non funziona? ****
                <br>
                Se non riesci a cliccare sul link, copialo e incollalo nella barra degli indirizzi del tuo browser.
                <br>
                ${link}
                <br><br>
                Una volta confermata l'iscrizione, potrai:
                <ul>
                    <li>Accedere a contenuti esclusivi riservati ai nostri iscritti.</li>
                    <li>Scrivere, commentare e partecipare alle discussioni sugli articoli che troverai sul blog.</li>
                    <li>Votare gli articoli più interessati.</li>
                </ul>
                Se non hai richiesto l'iscrizione al nostro blog, ti preghiamo di ignorare questa email.
                <br><br>
                Saluti,
                <br>
                lo staff di Blog<span style="color:#ff6d06;">TNV</span>
                <br><br>
            </td>
        </tr>
    </tbody>
</table>`,
    };
    return await mailer.createTransport(transport).sendMail(mailData);
}

const confirmRegistration = async(id, token) => {
    return await userRepository.confirmRegistration(id, token);
}

const login = async(email, password) => {
    const user = await userRepository.getByEmail(email);
    const result = cryptoUtils.compare(password, user.salt, user.password);
    if(!result){
        throw new UnauthorizedException('Unauthorized', 100201);
    }
    const tokens = cryptoUtils.generateTokens(user);
    user.tokens = tokens;
    return user;
}

export {
    register,
    buildRegistrationLink,
    sendRegistrationMail,
    confirmRegistration,
    login,
}