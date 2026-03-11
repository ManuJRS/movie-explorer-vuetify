export interface SignUpInput {
  email: string
  password: string
  username?: string
  wantsEmailNotifications?: boolean
}

export interface SignInInput {
  email: string
  password: string
}
