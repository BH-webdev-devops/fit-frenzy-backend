import { Request, Response } from "express";
import { query } from "../db/db";
import { getCurrentTimestamp, addWeightEntry, formatDate } from "../utils/helpers";
import bcrypt from 'bcryptjs';



export const addProfile = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    let { gender, age, weight, height, bio, location, birthday } = req.body;
    const image = '/public/images/' + req.file?.filename;
    const date = getCurrentTimestamp().toISOString()
    // Check if birthday is a valid date, otherwise set it to null
    if (!birthday || isNaN(Date.parse(birthday))) {
        birthday = null;
    } else {
        birthday = formatDate(birthday)
    }
    console.log('birthday', birthday)
    try {
        const user = await query(`SELECT * FROM users WHERE id = $1`, [userId])
        const profile = await query(`INSERT INTO profiles (user_id, gender, age, weight, height, bio, location, birthday, created_at, profile_picture) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [userId, gender, age, weight, height, bio, location, birthday, date, image]);

        // Add weight entry
        if (weight) {
            await addWeightEntry(weight, userId, date)
        }
        console.log('Profile added successfully');
        return res.status(200).json({ message: 'Profile data', result: profile.rows[0], user: user.rows[0] }
        )

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error`, details: err })
    }
}

export const getProfile = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    try {
        const user = await query(`SELECT * FROM users WHERE id = $1`, [userId])
        const profile = await query(`SELECT * FROM profiles WHERE user_id = $1`, [userId])
        console.log('Profile fetched successfully');
        // if (profile.rowCount === 0) {
        //     return res.status(404).json({ message: 'Profile not found' })
        // }
        return res.status(200).json({ message: 'Profile data', result: profile.rows[0], user: user.rows[0] }
        )
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error`, details: err })
    }
}

export const updateUserDetails = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const { name, email, password } = req.body;
    let updatedUser
    let updatedProfile
    try {
        const user = await query(`SELECT * FROM users WHERE id = $1`, [userId])
        if (user.rows.length == 0) {
            return res.status(404).json({ message: 'User not found' })
        }
        const currentUser = user.rows[0]
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const comparePasswords = await bcrypt.compare(password, currentUser.password)
            if (comparePasswords) {
                throw ({ message: `New password cannot be the same as the old password` })
            }
        }
        if (name != currentUser.name || email != currentUser.email || password) {
            updatedUser = await updateUser(userId, name, email, password, currentUser)
        }
        const profile = await query(`SELECT * FROM profiles WHERE user_id = $1`, [userId])
        if (profile.rows.length == 0) {
            return res.status(404).json({ message: 'Profile not found' })
        }
        updatedProfile = await updateProfile(req, profile)
        return res.status(200).json({ message: 'Profile updated successfully', result: updatedProfile, user: updatedUser || user.rows[0] })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error`, details: err })
    }
}


export const updateUser = async (user_id: Number, name: string, email: string, password: string, userRow: any): Promise<Response | any> => {
    try {
        name = name || userRow.name
        email = email || userRow.email
        password = password || userRow.password
        const comparePasswords = await bcrypt.compare(password, userRow.password)
        if (comparePasswords) {
            throw ({ message: `New password cannot be the same as the old password` })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await query('UPDATE users SET name=$1, email=$2, password=$3, updated_at=$5 WHERE id=$4 RETURNING *', [name, email, hashedPassword, user_id, getCurrentTimestamp().toISOString()]);
        console.log('User updated successfully', result);
        return result.rows[0];
    }
    catch (err) {
        throw err
    }
}

export const updateProfile = async (req: Request, profileRows: any): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    let { gender, age, weight, height, bio, location, birthday } = req.body;
    const image = '/public/images/' + req.file?.filename
    const date = getCurrentTimestamp().toISOString()
    if (!birthday || isNaN(Date.parse(birthday))) {
        birthday = null;
    } else {
        birthday = formatDate(birthday)
    }
    try {
        const currentProfile = profileRows.rows[0]
        const newGender = gender || currentProfile.gender
        const newAge = age || currentProfile.age
        const newWeight = weight || currentProfile.weight
        const newHeight = height || currentProfile.height
        const newBio = bio || currentProfile.bio
        const newLocation = location || currentProfile.location
        const newBirthday = birthday || currentProfile.birthday
        const newPicture = image || currentProfile.profile_picture
        profileRows = await query(`UPDATE profiles SET gender=$1, age=$2, weight=$3, height=$4, bio=$5, location=$6, birthday=$7, updated_at=$8, profile_picture=$10 WHERE user_id=$9 RETURNING *`,
            [newGender, newAge, newWeight, newHeight, newBio, newLocation, newBirthday, date, userId, newPicture])
        console.log('Profile updated successfully');
        if (weight) {
            await addWeightEntry(weight, userId, date)
        }
        return profileRows.rows[0]
    }
    catch (err) {
        throw ({ err })
    }
}



