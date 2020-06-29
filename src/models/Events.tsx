import { RoomBackendModel } from "./Room"

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

export type PlayerClickedGameCell = {
    category: string
    value: string
}

export type PlayerGaveAnswer = {
    answer: string
}

export type PlayerAnsweredCorrectly = {
    playerId: string,
    playerName: string,
    correctAnswer: string,
    game: RoomBackendModel
}

export type PlayerAnsweredIncorrectly = {
    playerId: string,
    playerName: string,
    incorrectAnswer: string,
    game: RoomBackendModel
}

export type AllPlayerAnsweredIncorrectly = {
    correctAnswer: string,
    game: RoomBackendModel
}