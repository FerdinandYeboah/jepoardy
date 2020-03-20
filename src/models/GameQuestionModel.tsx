export type GameQuestionModel = {
    question: String
    answers: String[]
}

export const defaultGameQuestion: GameQuestionModel = {
    question: "Who was the first woman?",
    answers: ["Abel", "Leah", "Rachel", "Eve"]
}