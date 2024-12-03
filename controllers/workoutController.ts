import { Request, Response } from "express";
import { query } from "../db/db";
import { getCurrentTimestamp } from "../utils/helpers";
import { getCaloriesBurnt } from "../utils/helpers";
import { getUserWeight } from "../utils/helpers";

export const addWorkout = async (req: Request, res: Response): Promise<Response | any> => {
    let calories_burnt = 0;
    const userId = (req as Request & { user: any }).user.id
    let { date, duration, type, description, exercise } = req.body;
    calories_burnt = await getCaloriesBurnt(exercise, await getUserWeight(userId), duration);
    date = date ? date : getCurrentTimestamp().toISOString();
    try {
        const workout = await query(
            'INSERT INTO workouts (user_id, date, duration, type, description, exercise, created_at, calories_burnt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [userId, date, duration, type, description, exercise, getCurrentTimestamp().toISOString(), Number(calories_burnt)]
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    try {
        const workouts = await query(
            `SELECT * FROM workouts WHERE user_id = $1 LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );
        const totalWorkouts = await query(
            `SELECT COUNT(*) FROM workouts WHERE user_id = $1`,
            [userId]
        );

        console.log('Workouts fetched successfully');
        if (workouts.rowCount === 0) {
            return res.status(404).json({ message: 'No workouts found' });
        }

        const totalPages = Math.ceil(parseInt(totalWorkouts.rows[0].count) / limit);

        return res.status(200).json({
            message: 'Workouts data',
            result: workouts.rows,
            pagination: {
                totalItems: parseInt(totalWorkouts.rows[0].count),
                totalPages: totalPages,
                currentPage: page,
                itemsPerPage: limit
            }
        });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error`, details: err })
    }
}

export const updateWorkout = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const { duration, type, description, exercise } = req.body;
    const { id } = req.params
    try {
        let workout = await query(`SELECT * FROM workouts WHERE id = $1`, [id])
        if (workout.rowCount === 0) {
            return res.status(404).json({ message: 'Workout not found' })
        }
        const currentWorkout = workout.rows[0]
        const newDuration = duration || currentWorkout.duration
        const newType = type || currentWorkout.type
        const newDescription = description || currentWorkout.description
        const newExercise = exercise || currentWorkout.exercise
        const newCaloriesBurnt = getCaloriesBurnt(newExercise, await getUserWeight(userId), newDuration);
        workout = await query(`UPDATE workouts SET duration=$1, type=$2, description=$3, exercise=$4, updated_at=$5, calories_burnt=$6, user_id=$7 WHERE id=$8 RETURNING *`,
            [newDuration, newType, newDescription, newExercise, getCurrentTimestamp().toISOString(), newCaloriesBurnt, userId, id])
        console.log('Workout updated successfully');
        return res.status(200).json({ message: 'Workout updated successfully', result: workout.rows[0] })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error`, details: err })
    }
}

export const filterByDate = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const { filterDate } = req.query
    console.log(req.body, filterDate)
    try {
        if (!filterDate) {
            return res.status(400).json({ message: 'Date is required' })
        }
        let limit_date;
        if (filterDate === "one_week") {
            limit_date = new Date(getCurrentTimestamp().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        } else if (filterDate === "one_month") {
            limit_date = new Date(getCurrentTimestamp().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        } else if (filterDate === "three_months") {
            limit_date = new Date(getCurrentTimestamp().getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
        } else if (filterDate === "six_months") {
            limit_date = new Date(getCurrentTimestamp().getTime() - 180 * 24 * 60 * 60 * 1000).toISOString();
        } else if (filterDate === "one_year") {
            limit_date = new Date(getCurrentTimestamp().getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
        } else {
            return res.status(400).json({ message: 'Invalid filter date' });
        }
        console.log(limit_date)
        const workout = await query(`SELECT * FROM workouts WHERE user_id = $1 AND date > $2`, [userId, limit_date])
        console.log('Workout fetched successfully');
        if (workout.rowCount === 0) {
            return res.status(404).json({ message: 'Workout not found', result: workout.rows })
        }
        return res.status(200).json({ message: 'Workout data', result: workout.rows }
        )
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error`, details: err })
    }
}

export const deleteWorkout = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const workoutId = req.params.id;
    try {
        if (!workoutId) {
            return res.status(400).json({ message: 'Workout ID is required' })
        }
        const workout = await query(`DELETE FROM workouts WHERE id = $1 RETURNING *`, [workoutId])
        console.log('Workout deleted successfully');
        if (workout.rowCount === 0) {
            return res.status(404).json({ message: 'Workout not found' })
        }
        return res.status(200).json({ message: 'Workout deleted successfully', result: workout.rows[0] })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error`, details: err })
    }
}

export const fetchActivities = async (req: Request, res: Response): Promise<Response | any> => {
    const category = req.query.category;
    const filter = req.query.filter || '';
    try {
        const result = await query('SELECT activity FROM activities WHERE category = $1 AND activity ILIKE $2', [category, `%${filter}%`]);
        if (result.rowCount === 0) {
            return []
        }
        res.json(result.rows.map(i => i.activity));
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ message: `Internal server error`, details: error });
    }
};