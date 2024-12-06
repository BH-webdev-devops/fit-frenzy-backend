import { Request, Response } from "express";
import { query } from "../db/db";
import { getCurrentTimestamp, paginationResult, formatDate } from "../utils/helpers";

export const addPost = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    let { title, content, image } = req.body;
    let userName = ''
    const date = formatDate(getCurrentTimestamp().toISOString())
    let user = await query(`SELECT * FROM users WHERE id = $1`, [userId])
    if (user.rowCount === 0) {
        userName = 'Anonymous'
    } else {
        userName = user.rows[0].name
    }
    try {
        const post = await query(`INSERT INTO posts (user_id, title, content, image, created_at, user_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [userId, title, content, image, date, userName]);
        console.log('Post added successfully');
        return res.status(200).json({ message: 'Post data', result: post.rows[0] }
        )

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error`, details: err })
    }
}

export const getPosts = async (req: Request, res: Response): Promise<Response | any> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    try {
        const posts = await query(
            `SELECT * FROM posts LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        const totalPosts = await query(
            `SELECT COUNT(*) FROM posts`
        );

        console.log('Posts fetched successfully');
        // if (posts.rowCount === 0) {
        //     return res.status(404).json({ message: 'No posts found' });
        // }
        console.log("date format", (posts.rows[0].created_at))

        const pagination = paginationResult(totalPosts, page, limit);
        return res.status(200).json({
            message: 'Posts data',
            result: posts.rows,
            pagination: pagination
        });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error`, details: err })
    }
}

export const deletePost = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const postId = req.params.id;
    try {
        const post = await query(`DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *`, [postId, userId]);
        console.log('Post deleted successfully');
        return res.status(200).json({ message: 'Post deleted', result: post.rows[0] }
        )

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error`, details: err })
    }
}

export const updatePost = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const postId = req.params.id;
    let { title, content, image } = req.body;
    try {
        let post = await query(`SELECT * FROM posts WHERE id = $1`, [postId])
        if (post.rowCount === 0) {
            return res.status(404).json({ message: 'Post not found' })
        }
        const currentPost = post.rows[0]
        const newTitle = title || currentPost.title
        const newContent = content || currentPost.content
        const newImage = image || currentPost.image
        post = await query(`UPDATE posts SET title = $1, content = $2, image = $3 WHERE id = $4 AND user_id = $5 RETURNING *`,
            [newTitle, newContent, newImage, postId, userId]);
        console.log('Post updated successfully');
        return res.status(200).json({ message: 'Post updated', result: post.rows[0] }
        )

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error`, details: err })
    }
}

export const addReply = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    let userName = ''
    const postId = req.params.id;
    let { comment } = req.body;
    const date = formatDate(getCurrentTimestamp().toISOString())
    console.log("date", date, comment, postId, userId)
    let user = await query(`SELECT * FROM users WHERE id = $1`, [userId])
    if (user.rowCount === 0) {
        userName = 'Anonymous'
    } else {
        userName = user.rows[0].name
    }

    try {
        const post = await query(`INSERT INTO replies (user_id, post_id, comment, created_at, user_name) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [userId, postId, comment, date, userName]);
        console.log('Reply added successfully');
        return res.status(200).json({ message: 'Reply data', result: post.rows[0] }
        )

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error`, details: err })
    }
}

export const getReplies = async (req: Request, res: Response): Promise<Response | any> => {
    const postId = req.params.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    try {
        const replies = await query(
            `SELECT * FROM replies WHERE post_id = $1 LIMIT $2 OFFSET $3`,
            [postId, limit, offset]
        );
        const allReplies = await query(
            `SELECT COUNT(*) FROM replies WHERE post_id = $1`,
            [postId]
        );

        console.log('Replies fetched successfully');
        // if (posts.rowCount === 0) {
        //     return res.status(404).json({ message: 'No replies found' });
        // }

        const pagination = paginationResult(allReplies, page, limit);
        return res.status(200).json({
            message: 'Replies data',
            result: replies.rows,
            pagination: pagination
        });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error`, details: err })
    }
}

export const deleteReply = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const replyId = req.params.id;
    try {
        const post = await query(`DELETE FROM replies WHERE id = $1 AND user_id = $2 RETURNING *`, [replyId, userId]);
        console.log('Reply deleted successfully');
        return res.status(200).json({ message: 'Reply deleted', result: post.rows[0] }
        )

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error`, details: err })
    }
}