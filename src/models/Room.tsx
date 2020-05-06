export interface RoomBackendModel {
    id: number;
    name: string | undefined;
    topic: string | undefined;
    file: string | undefined;
    players: Player[];
    state: State;
}

export interface RoomFrontendModel {
    key: number
    id: number
    name: String | undefined
    numPlayers: number | undefined
    topic: String | undefined
    status: State
}

export function convertRoomModelBE2FE (backendModel: RoomBackendModel, key: number): RoomFrontendModel {
    let frontendModel: RoomFrontendModel = {
        key: key,
        id: backendModel.id,
        name: backendModel.name,
        numPlayers: backendModel.players.length,
        topic: backendModel.topic,
        status: backendModel.state
    }

    return frontendModel;
}

export function convertRoomModelListBE2FE (backendModels: RoomBackendModel[]): RoomFrontendModel[] {
    let frontendModels = backendModels.map(function(model, index){
        return convertRoomModelBE2FE(model, index);
    })

    return frontendModels;
}

export interface Player {
    name: string;
    score: number;
    id: string;
}

export enum State {
    LOBBY,
    GAME
}