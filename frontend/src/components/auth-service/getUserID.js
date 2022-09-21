function getUserID() {
    const userIDString = localStorage.getItem('userID');
    const userID = JSON.parse(userIDString);
    return userID
}

export default getUserID