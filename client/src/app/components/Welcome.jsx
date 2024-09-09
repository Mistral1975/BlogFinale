import styles from "../page.module.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/userSlice";

export const Welcome = ()=> {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    return (
        <div className={styles.topBar}>
            <div className={styles.welcome}>
                Welcome {user.name} !
            </div>
            <div onClick={()=>{ dispatch(logout()) }}>
                Logout
            </div>
        </div>
    )
}