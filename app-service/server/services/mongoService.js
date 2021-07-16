const axios = require('axios');

axios.defaults.baseURL = 'http://localhost:3002/api';


const addUser = async (user) => {
    try {
        const newUser = (await axios.post(`/user`, user)).data;
        return newUser;
    } catch (error) {
        throw error;
    }
};

const updateVideoDetails = async (videoId, updateDetails) => {
    try {
        const updatedVideo = (await axios.patch(`/video/${videoId}`, updateDetails)).data;
        return updatedVideo;
    } catch (error) {
        throw error;
    }
};

const getPhysioDetailsByPracticeId = async (PracticeVideoId) => {
    try {
        const practiceVideo = (await axios.get(`/video/${PracticeVideoId}`)).data;
        const physioVideo = (await axios.get(`/video/${practiceVideo.physioVideoId}`)).data;
        return physioVideo;
    } catch (error) {
        throw error;
    }
};

const getUserByVideoId = async (videoId) => {
    try {
        const practiceVideo = (await axios.get(`/video/${videoId}`)).data;
        const userDetails = (await axios.get(`/user/${practiceVideo.uploader}`)).data;
        return userDetails;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addUser,
    updateVideoDetails,
    getPhysioDetailsByPracticeId,
    getUserByVideoId
};