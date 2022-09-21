import { useState } from 'react';
import getToken from './getToken';
import getUserID from './getUserID';
import getIsAdmin from './getIsAdmin';
import saveUserID from './saveUserID';
import saveToken from './saveToken';
import saveIsAdmin from './saveIsAdmin';

function useUser() {

    const localInfo = {
        token: getToken() ? getToken() : "",
        userId: getUserID() ? getUserID() : "",
        isAdmin: getIsAdmin() ? getIsAdmin() : 0
    }
    const [user, setUser] = useState(localInfo);
    
    const editUser = (user) => {
        if (user) {
            setUser(user);
            saveUserID(user.userId);
            saveToken(user.token);
            saveIsAdmin(user.isAdmin);
        }
    }
    
    return {
        user: user,
        setUser: editUser
    }
}

export default useUser