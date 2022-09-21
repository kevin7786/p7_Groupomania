function saveToken (userToken) {
    localStorage.setItem('token', JSON.stringify(userToken));
}

export default saveToken