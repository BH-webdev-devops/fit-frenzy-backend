interface Profile {
    id: number;
    user_id: number;
    bio: string;
    gender: string;
    age: number;
    weight: number;
    height: number;
    location: string;
    birthdate: string | null;
    profile_picture: string;
}
export type { Profile }