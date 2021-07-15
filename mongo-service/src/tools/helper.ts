import { IUser } from "../models/user";
import { IVideo } from "../models/video";

const getUserDTO = (users: Partial<IUser>[]): Partial<IUser>[]=> {
    if(users.filter(Boolean).length === 0) return [];
     
    return users.map((user: Partial<IUser>) => {
        const {password, __v, ...userDTO} = user;
        return userDTO;
    });
};

const getVideoDTO = (videos: Partial<IVideo>[]): Partial<IVideo>[]=> {
    if(videos.filter(Boolean).length === 0) return [];
     
    return videos.map((video: Partial<IVideo>) => {
        const {__v, ...videoDTO} = video;
        return videoDTO;
    });
};

export {
    getUserDTO,
    getVideoDTO
}