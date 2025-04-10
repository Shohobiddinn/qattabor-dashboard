export interface LoginType {
    username: string,
    password: string
}
export interface AuthType {
    user: AuthUserType,
    role: string,
    token_type: string,
    access_token: string,
    refresh_token: string

}
export interface AuthUserType {
    id: number | string,
    username: string,
    name: string,
    role: string,
    photo: string | null,
    created_at: string,
    updated_at: string
}