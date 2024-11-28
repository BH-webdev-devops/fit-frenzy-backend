interface Workout {
    id: number;
    user_id: number;
    exercise: string;
    description: string;
    duration: number;
    date: Date;
    type: string;
}

export type { Workout }