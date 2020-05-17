import { RoomBackendModel, Question } from "./Room"
import { v4 as uuidv4 } from 'uuid';

export type UpcomingQuestionModel = {
    category: String
    value: Number
}

export const defaultUpcoming: UpcomingQuestionModel = {
    category: "Default",
    value: 400
}

export type GameQuestionModel = {
    question: String
    answers: String[]
}

export const defaultGameQuestion: GameQuestionModel = {
    question: "Who was the first woman?",
    answers: ["Abel", "Leah", "Rachel", "Eve"]
}

export interface ScoreBoardModel {
    // columns: ScoreBoardColumn[]
    // data: ScoreBoardData[]
    columns: any[]
    data: any[]
}

export interface GameBoardModel {
    columns: any[]
    data: any[]
}

interface ScoreBoardColumn {
    title: string
    dataIndex: string,
    key: string,
}

interface ScoreBoardData { //So I can't use typing on this..... since dynamically determined...

}

//Examples - Will have to dynamically generate these
export const hardcodedScoreBoardColumns = [
    {
        title: 'Ferdinand',
        dataIndex: 'ferdinand',
        key: 'ferdinand',
    },
    {
        title: 'Eugene',
        dataIndex: 'eugene',
        key: 'eugene',
    }
];

export const hardcodedScoreBoardData = [
    // Each object represents a row
    {
        key: '1',
        ferdinand: "$200",
        eugene: "$300",
    }
];

export const hardcodedGameBoardData = [
    // Each object represents a row
    {
        key: '1',
        Genesis: "$200",
        Exodus: "$200",
        Leviticus: "$200",
        Duet: "$200",
        Numbers: "$200",
    },
    {
        key: '2',
        Genesis: "$400",
        Exodus: "$400",
        Leviticus: "$400",
        Duet: "$400",
        Numbers: "$400",
    }
];

//Conversion functions
export function convertRoomModelBE2ScoreBoard(room: RoomBackendModel | undefined): ScoreBoardModel {
    let scoreBoard: ScoreBoardModel = {
        columns: [],
        data: []
    };

    //Create rows, will only be one
    let dataObject: any = {}
    dataObject.key = '1';

    if ( room == undefined) return scoreBoard;

    //Iterate through players
    room.players.forEach((player, index) => {
        //Add a column per player
        scoreBoard.columns.push({
            title: player.name,
            dataIndex: index.toString(),
            key: index.toString()
        })

        //Add in row data
        dataObject[index.toString()] = player.score;
    });

    scoreBoard.data.push(dataObject);

    return scoreBoard;
}

export function convertRoomModelBE2GameBoard(room: RoomBackendModel | undefined): GameBoardModel {
    let gameBoard: GameBoardModel = {
        columns: [],
        data: []
    };

    if ( room == undefined) return gameBoard;

    let categoriesSeen: string[] = []

    //Iterate through questions
    room.file.questions.forEach((question, index) => {

        //Add columns - categories. Add to title column if haven't seen before.
        if (!categoriesSeen.includes(question.category)){
            gameBoard.columns.push({
                title: question.category,
                dataIndex: question.category,
                key: question.category
            });

            categoriesSeen.push(question.category);
        }

    });

    //Add row data - Loop through keys of object to do so
    let valueIndexedQuestions = reformatQuestionsByValue(room.file.questions);
    
    for (const value in valueIndexedQuestions) {
        if (valueIndexedQuestions.hasOwnProperty(value)) {
            let rowObject: any = {} //If need to pass a key, pass it here
            rowObject.key = uuidv4();
            const questionsList = valueIndexedQuestions[value];
            
            questionsList.forEach((q: any) => {
                rowObject[q.category] = value;
            });

            gameBoard.data.push(rowObject);
        }
    }

    return gameBoard;
}

function reformatQuestionsByValue(questions: Question[]){
    let obj: any = {}

    //Reorder list by value
    questions.forEach(question => {
        !obj[question.value] ? obj[question.value] = [question] : obj[question.value].push(question)
    });

    return obj;
}