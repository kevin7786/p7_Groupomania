function getIsAdmin() {
    const isAdminString = localStorage.getItem('isAdmin');
    const userIsAdmin = JSON.parse(isAdminString);
    return userIsAdmin === 'true'
}

export default getIsAdmin