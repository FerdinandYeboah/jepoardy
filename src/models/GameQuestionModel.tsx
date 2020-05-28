export type GameQuestionModel = {
    question: String
    answers: Answer
}

export const defaultGameQuestion: GameQuestionModel = {
    question: "Who was the first woman?",
    answers: {
        "A": "Abel",
        "B": "Leah",
        "C": "Rachel",
        "D": "Eve"
    }
}

interface Answer {
    // This is syntax for when definining a hashmap type.
    [key: string] : string;
}