import { Request, Response } from 'express';
import { User } from '../types/User';
import { query } from '../db/db';


export const checkIfAdmin = async (req: Request, res: Response, next: Function): Promise<Response | any> => {
    console.log('Checking if user is admin');
    const userId = (req as Request & { user: any }).user.id
    try {
        const user = await query('SELECT * FROM users WHERE id = $1', [userId]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('User is admin:', user.rows[0].admin);
        if (!user.rows[0].admin) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        console.error('Error checking if user is admin:', error);
        return res.status(500).json({ error: 'Error checking if user is admin' });
    }
}


export const getAllUsers = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const users = await query('SELECT * FROM users');
        return res.status(200).json({ message: "Fetched all users", result: users.rows });
    } catch (error) {
        console.error('Error getting all users:', error);
        return res.status(500).json({ error: 'Error getting all users' });
    }
}

export const getUserById = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = req.params.id;
    try {
        const user = await query('SELECT * FROM profiles WHERE id = $1', [userId]);
        console.log('User:', user.rows);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ result: user.rows[0] });
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return res.status(500).json({ error: 'Error getting user by ID' });
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = req.params.id;
    try {
        const user = await query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
        if (user.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully', result: user.rows });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'Error deleting user' });
    }
}