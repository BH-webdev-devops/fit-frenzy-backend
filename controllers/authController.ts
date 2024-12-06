import { Request, Response } from 'express';
import { query } from '../db/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { User } from '../types/User';
import { getCurrentTimestamp, formatDate } from '../utils/helpers';


export const registerUser = async (req: Request, res: Response): Promise<Response | any> => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await query('INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, hashedPassword, getCurrentTimestamp().toISOString()]);
        console.log('User registered success');
        return res.status(201).json({ message: 'User registered successfully', user: { name, email } });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Error registering user' });
    }
}

export const loginUser = async (req: Request, res: Response): Promise<Response | any> => {
    const user = (req as Request & { user: User }).user
    console.log(user)

    try {
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: `Invalid credentials` })
        }
        const token = jwt.sign({ id: user.id }, String(process.env.JWT_SECRET), { expiresIn: '6h' })
        return res.status(200).json({ message: 'Login successful', token: 'Bearer ' + token, user: { id: user.id, name: user.name, email: user.email, admin: user.admin } })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const forgotPassword = async (req: Request, res: Response): Promise<Response | any> => {
    const { email, birthdate, newPassword } = req.body;
    console.log(req.body)
    try {
        if (!email || !birthdate || !newPassword) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        if (await validatePassword(newPassword)) {
            return res.status(403).json({ message: 'Password must be at least 8 characters long and include $' });
        }

        let user = await query('SELECT * FROM users WHERE email = $1 ', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userId = user.rows[0].id;
        const profileResult = await query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
        if (profileResult?.rows?.length == 0 || (profileResult.rows[0].birthday != null && formatDate(profileResult.rows[0].birthday) !== (birthdate))) {
            return res.status(404).json({ message: 'User not found' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Internal server error` });
    }
}

const validatePassword = async (password: string) => {
    if (password.length < 8) {
        return false
    } else if (!password.includes('$')) {
        return false
    }
    return true
}
