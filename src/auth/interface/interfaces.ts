export interface PayloadData {
    userId: string
    login: string
    role: string
}

export interface GetTokenOptions{
    id:string
    login:string
    role:string
}

export interface PayloadDataInRefresh{
    userId: string,
    login: string,
    role: string,
    iat: number,
    exp: number
}

