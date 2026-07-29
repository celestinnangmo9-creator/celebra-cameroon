export default function ApplicationLogo(props) {
    return (
        <img 
            {...props} 
            src="/images/logo.png" 
            alt="Celebra Cameroon Logo" 
            className={`logo-img ${props.className || ''}`}
        />
    );
}
