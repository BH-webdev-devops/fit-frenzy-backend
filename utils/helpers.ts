import { query } from '../db/db'
import { Request, Response } from 'express';

export const getCurrentTimestamp = (): any => {
    const currentTimestamp = new Date();
    return currentTimestamp
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const getCaloriesBurnt = async (exercise: string, weightInKg: number, duration: number): Promise<any> => {
    let caloriesBurnt = 0;
    let MET = 5 // Default MET value, adjust as needed, Metabolic Equivalent of Task
    let activity = await query(`SELECT calories_per_kilo FROM activities WHERE activity = $1`, [exercise]);
    console.log(activity)
    if (activity.rowCount != 0) {
        MET = activity.rows[0].calories_per_kilo;
    }
    console.log(weightInKg, typeof weightInKg, duration, typeof duration)
    caloriesBurnt = Number(MET) * Number(weightInKg) * duration / 60;
    console.log(caloriesBurnt.toFixed(2))

    return Number(caloriesBurnt.toFixed(2));
}

export const getUserWeight = async (userId: any): Promise<any> => {
    const user = await query(`SELECT weight FROM profiles WHERE user_id = $1`, [userId]);
    if (user.rowCount === 0) {
        return 60
    }
    return user.rows[0].weight;
}

export const addWeightEntry = async (userId: number, weight: number, date: Date) => {
    try {
        await query('INSERT INTO weight_entries (user_id, weight, date) VALUES ($1, $2, $3)', [userId, weight, date]);
        console.log('Weight entry added successfully');
    }
    catch (err) {
        console.log(err)
    }
}

export const getWeightEntries = async (req: Request, res: Response): Promise<any> => {
    console.log('Get weight entries')
    try {
        const userId = (req as Request & { user: any }).user.id
        const weightEntries = await query('SELECT * FROM weight_entries WHERE user_id = $1 ORDER BY date ASC', [userId]);
        console.log('Weight entries fetched successfully');
        return res.status(200).json({ message: 'Weight entries', result: weightEntries.rows });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const paginationResult = (totalWorkouts: any, page: number, limit: number) => {
    const totalItems = parseInt(totalWorkouts.rows[0].count);
    const totalPages = Math.ceil(totalWorkouts.rows[0].count / limit);
    const pagination = { totalItems: totalItems, currentPage: page, totalPages: totalPages, itemsPerPage: limit };
    return pagination
}

