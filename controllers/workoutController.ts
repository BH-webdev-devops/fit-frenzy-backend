import { Request, Response } from "express";
import { query } from "../db/db";
import { getCurrentTimestamp } from "../utils/helpers";

export const addWorkout = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const { duration, type, description, exercise } = req.body;
    const calories_burnt = 100
    try {
        const workout = await query(
            'INSERT INTO workouts (user_id, date, duration, type, description, exercise, created_at, calories_burnt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [userId, await getCurrentTimestamp(), duration, type, description, exercise, await getCurrentTimestamp(), calories_burnt]
        );
        console.log('Workout added successfully');
        return res.status(200).json({ message: 'Workout data', result: workout.rows[0] }
        )

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const getWorkout = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    try {
        const workout = await query(`SELECT * FROM workouts WHERE user_id = $1`, [userId])
        console.log('Workout fetched successfully');
        if (workout.rowCount === 0) {
            return res.status(404).json({ message: 'Workout not found' })
        }
        return res.status(200).json({ message: 'Workout data', result: workout.rows }
        )
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const updateWorkout = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user
    const { duration, type, description, exercise } = req.body;
    try {
        let workout = await query(`SELECT * FROM workouts WHERE id = $1`, [userId])
        if (workout.rowCount === 0) {
            return res.status(404).json({ message: 'Workout not found' })
        }
        const currentWorkout = workout.rows[0]
        const newDuration = duration || currentWorkout.duration
        const newType = type || currentWorkout.type
        const newDescription = description || currentWorkout.description
        const newExercise = exercise || currentWorkout.exercise
        const newCaloriesBurnt = 200
        workout = await query(`UPDATE workouts SET duration=$1, type=$2, description=$3, exercise=$4, updated_at=$5, calories_burnt WHERE user_id=$6 RETURNING *`,
            [newDuration, newType, newDescription, newExercise, await getCurrentTimestamp(), newCaloriesBurnt, userId])
        console.log('Workout updated successfully');
        return res.status(200).json({ message: 'Workout updated successfully', result: workout.rows[0] })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}
