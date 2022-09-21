function saveUserID (userID) {
    localStorage.setItem('userID', JSON.stringify(userID));
}

export default saveUserID