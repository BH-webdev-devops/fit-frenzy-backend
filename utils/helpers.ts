import { query } from '../db/db'

export const getCurrentTimestamp = (): any => {
    const currentTimestamp = new Date();
    return currentTimestamp
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

    return caloriesBurnt;
}

export const getUserWeight = async (userId: any): Promise<any> => {
    const user = await query(`SELECT weight FROM profiles WHERE user_id = $1`, [userId]);
    if (user.rowCount === 0) {
        return 60
    }
    return user.rows[0].weight;
}
