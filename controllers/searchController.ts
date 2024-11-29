import { Request, Response } from "express";
import fetch from "node-fetch";

const YOUTUBE_API_KEY = "AIzaSyD_e3430eIWNzE_U2-q_ZrWwL4CJgBZlZ8";
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

export const searchGymVideos = async (req: Request, res: Response): Promise<Response | any> => {
    const searchQuery = req.query.query as string;

    try {
        const response = await fetch(`${YOUTUBE_API_URL}?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&key=${YOUTUBE_API_KEY}`);
        const data: any = await response.json();

        if (!data.items || data.items.length === 0) {
            return res.status(404).json({ message: 'No videos found' });
        }

        const videos = data.items.map((item: any) => ({
            title: item.snippet.title,
            description: item.snippet.description,
            videoId: item.id.videoId,
            thumbnail: item.snippet.thumbnails.default.url
        }));

        return res.status(200).json(videos);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Internal server error`, details: err });
    }
};