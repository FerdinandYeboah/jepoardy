export type UserCreated = {
    name: string
}

export type RoomCreated = {
    roomName: string
    fileId: number
}

export type UserJoinedGame = {
    gameId: number
}