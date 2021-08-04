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

const getUser = async (Identifier) => {
    try {
        const user = (await axios.get(`/user/${Identifier}`)).data;
        return user;
    } catch (error) {
        throw error;
    }
};

const login = async (user) => {
    try {
        const userLogin = (await axios.post(`/user/login`, user)).data;
        return userLogin;
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

const addVideo = async (video) => {
    try {
        const newVideo = (await axios.post(`/video`, video)).data;
        return newVideo;
    } catch (error) {
        throw error;
    }
};

const getAllPhysioVideo = async (q) => {
    try {
        const PhysioVideos = (await axios.get(`/video?isPatient=false`)).data;
        return PhysioVideos;
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

const practiceOfVideoPerUser = async (userId, videoId) => {
    try {
        const practiceVideo = (await axios.get(`/video/user/${userId}/practices/${videoId}`)).data;
        return practiceVideo;
    } catch (error) {
        console.log(error)
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
    getUser,
    login,
    updateVideoDetails,
    getAllPhysioVideo,
    practiceOfVideoPerUser,
    addVideo,
    getPhysioDetailsByPracticeId,
    getUserByVideoId
};