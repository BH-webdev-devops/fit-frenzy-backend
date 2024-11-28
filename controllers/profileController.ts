import { Request, Response } from "express";
import { query } from "../db/db";
import { getCurrentTimestamp } from "../utils/helpers";

export const addProfile = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const { gender, age, weight, height, bio, location, birthday } = req.body;
    const image = '/public/images/' + req.file?.filename;
    console.log(req.body, req.file);
    try {
        const user = await query(`SELECT * FROM users WHERE id = $1`, [userId])
        const profile = await query(`INSERT INTO profiles (user_id, gender, age, weight, height, bio, location, birthday, created_at, profile_picture) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [userId, gender, age, weight, height, bio, location, birthday, getCurrentTimestamp().toISOString(), image]);

        console.log('Profile added successfully');
        return res.status(200).json({ message: 'Profile data', result: profile.rows[0], user: user.rows[0] }
        )

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const getProfile = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    try {
        const user = await query(`SELECT * FROM users WHERE id = $1`, [userId])
        const profile = await query(`SELECT * FROM profiles WHERE user_id = $1`, [userId])
        console.log('Profile fetched successfully');
        if (profile.rowCount === 0) {
            return res.status(404).json({ message: 'Profile not found' })
        }
        return res.status(200).json({ message: 'Profile data', result: profile.rows[0], user: user.rows[0] }
        )
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const updateProfile = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const { gender, age, weight, height, bio, location, birthday, profile_picture } = req.body;
    try {
        const user = await query(`SELECT * FROM users WHERE id = $1`, [userId])
        let profile = await query(`SELECT * FROM profiles WHERE id = $1`, [userId])
        if (profile.rowCount === 0) {
            return res.status(404).json({ message: 'Profile not found' })
        }
        const currentProfile = profile.rows[0]
        const newGender = gender || currentProfile.gender
        const newAge = age || currentProfile.age
        const newWeight = weight || currentProfile.weight
        const newHeight = height || currentProfile.height
        const newBio = bio || currentProfile.bio
        const newLocation = location || currentProfile.location
        const newBirthday = birthday || currentProfile.birthday
        const newPicture = profile_picture || currentProfile.profile_picture
        profile = await query(`UPDATE profiles SET gender=$1, age=$2, weight=$3, height=$4, bio=$5, location=$6, birthday=$7, updated_at=$8, profile_picture=$10 WHERE user_id=$9 RETURNING *`,
            [newGender, newAge, newWeight, newHeight, newBio, newLocation, newBirthday, getCurrentTimestamp().toISOString(), userId, newPicture])
        console.log('Profile updated successfully');
        return res.status(200).json({ message: 'Profile updated successfully', result: profile.rows[0], user: user.rows[0] })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}
