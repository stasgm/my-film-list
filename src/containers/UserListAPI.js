const UserListAPI = {
    users: [
        {
            id: 0,
            name: 'Stas',
            age: 35,
        },
        {
            id: 1,
            name: 'Olya',
            age: 28,
        },
        {
            id: 3,
            name: 'Nox',
            age: 9,
        },
    ],
    all() {
        return this.users;
    },
    get(id) {
        return this.users.find(item => item.id === id);
    },
};


export default UserListAPI;
