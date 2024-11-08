export interface ITaskItem {
    id: string;
    title: string;
    description: string;
    status: string,
    assignee?: number,
    owner_id?: number
}

export interface IFilterTask {
    text: string;
    status: string;
}

export type ITasksState = ITaskItem[];