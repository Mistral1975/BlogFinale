import logoImage from "../images/logo.svg";

export const Logo = (props) => {
    return (
        <img src={logoImage.src} alt={props.alt} />
    );
}