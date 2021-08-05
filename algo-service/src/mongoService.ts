import axios from 'axios';
import config from './config';
import { User, Video } from './types';
const { mongoBaseUrl } = config;
axios.defaults.baseURL = mongoBaseUrl;

/**
 * Update video
 * @param videoId 
 * @param updateDetails 
 * @returns 
 */
const updateVideoDetails = async (videoId: string, updateDetails: Partial<Video>): Promise<Video> => {
    try {
        const updatedVideo: Video = (await axios.patch(`/video/${videoId}`, updateDetails)).data;
        return updatedVideo;
    } catch (error) {
        throw error;
    }
};

/**
 * Fetch video details of video of physio according to videoid of patient
 * @param PracticeVideoId 
 * @returns 
 */
const getPhysioDetailsByPracticeId = async (PracticeVideoId: string): Promise<Video> => {
    try {
        const practiceVideo: Video = (await axios.get(`/video/${PracticeVideoId}`)).data;
        const physioVideo: Video = (await axios.get(`/video/${practiceVideo.physioVideoId}`)).data;
        return physioVideo;
    } catch (error) {
        throw error;
    }
};

/**
 * Get user by videoId
 * @param videoId 
 * @returns 
 */
const getUserByVideoId = async (videoId: string): Promise<User> => {
    try {
        const practiceVideo: Video = (await axios.get(`/video/${videoId}`)).data;
        const userDetails: User = (await axios.get(`/user/${practiceVideo.uploader}`)).data;
        return userDetails;
    } catch (error) {
        throw error;
    }
};

export default {
    updateVideoDetails,
    getPhysioDetailsByPracticeId,
    getUserByVideoId
};