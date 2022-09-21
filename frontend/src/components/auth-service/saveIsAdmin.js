function saveToken (userIsAdmin) {
    localStorage.setItem('isAdmin', JSON.stringify(userIsAdmin.toString()));
}

export default saveToken