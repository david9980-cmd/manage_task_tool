import { TaskHistory } from "../consts/index"

const useTaskHistory = (status: string): string[] => {

    const { Todo, InProgress, Blocked, InQA, Done, Deployed } = TaskHistory;

    switch (status) {
        case Todo:
            return [Todo, InProgress];
        case InProgress:
            return [InProgress, Blocked, InQA];
        case Blocked:
            return [Blocked, Todo];
        case InQA:
            return [InQA, Todo, Done];
        case Done:
            return [Done, Deployed];
        case Deployed:
            return [Done];
        default:
            return [];
    }
}

export default useTaskHistory;