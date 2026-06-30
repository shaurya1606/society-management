export class UserAlreadyExistsError extends Error {
    constructor(email: string) {
        super('User already exists')
        this.name = 'UserAlreadyExistsError'
        this.email = email
    }

    readonly email: string
}
