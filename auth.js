const AuthModule = (function() {
    function login(email, password) {
        const users = StorageModule.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            StorageModule.setCurrentUser(user);
            return { success: true, user };
        }
        return { success: false, message: 'Invalid credentials. Try the demo accounts!' };
    }
    
    function logout() {
        StorageModule.clearSession();
        location.reload();
    }
    
    return { 
        login, 
        logout, 
        getCurrentUser: StorageModule.getCurrentUser 
    };
})();