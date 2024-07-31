interface User {
    first_name: string
    last_name: string
    user_name: string
    email: string
    password: string
    profile: string
    role: 'ADMIN' | 'USER'
    createdAt: Date
    updatedAt: Date
}