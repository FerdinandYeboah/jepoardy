export interface RoomBackendModel {
    id: number;
    name: string | undefined;
    topic: string | undefined;
    file: string | undefined;
    players: Player[];
    state: State;
}

export interface RoomFrontendModel {
    question: String
    answers: String[]
}

interface Player {
    name: string;
    score: number;
    socket: any;
}

enum State {
    LOBBY,
    GAME
}