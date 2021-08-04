import { Request, Response } from "express";
import _ from "lodash";
import { LeanDocument } from "mongoose";
import { Video, IVideo } from '../models/video';
import { validateMongoID } from "../tools/validation";

export const allVideos = async (req: Request, res: Response) => {
    const query = {...req.query}; //isPatient
    try {
        const videos: LeanDocument<IVideo[]> = await Video.find(query).exec();
        res.send(videos);
    } catch (error) {
        res.status(400).send("There is problem in fetch the data");
    }
};

export const allVideosOfUser = async (req: Request, res: Response) => {
    try {
        const query = {uploader: req.params.userId, ...req.query}; // isPatient
        const videos: LeanDocument<IVideo[]> = await Video.find(query).exec();
        res.send(videos);
    } catch (error) {
        res.status(404).send("There is problem in fetch the data");
    }
};

export const allPracticeOfVideo = async (req: Request, res: Response) => {
    try {
        const query = {physioVideoId: req.params.videoId};
        const videos: LeanDocument<IVideo[]> = await Video.find(query).exec();
        res.send(videos);
    } catch (error) {
        res.status(400).send("There is problem in fetch the data");
    }
};

export const practiceOfVideoPerUser = async (req: Request, res: Response) => {
    try {
        const query = {physioVideoId: req.params.videoId, uploader: req.params.userId, isPatient: true};
        const videos: LeanDocument<IVideo[]> = await Video.find(query).exec();
        res.send(videos);
    } catch (error) {
        res.status(400).send("There is problem in fetch the data");
    }
};

export const getVideoById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    let video: LeanDocument<IVideo>;
    if (validateMongoID(id)) {
        try {
            video = await Video.findById(id).exec();
            res.send(video);
        } catch (error) {
            res.status(404).send("video cant find");
        }
    }
    res.status(405).send("the id isnt valid");
};

export const deleteVideo = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    if (validateMongoID(id)) {
        try {
            const video: LeanDocument<IVideo> = await Video.findOneAndDelete({ _id: id }).lean().exec();
            return !!video ? res.send(video) : res.status(404).send(`video with id: ${id} cant find`);
        } catch (error) {
            res.status(400).send("There is problem in fetch the data");
        }
    }
    res.status(405).send("the id isnt valid");
};

export const updateVideo = async (req: Request, res: Response) => {
    const updateValue: Partial<IVideo> = _.pick(req.body, ['title',
        'description',
        'videoPath',
        'duration',
        'thumbnail',
        'jsonPath',
        'optimalGraphPath',
        'twoLineGraphPath',
        'score',
        'userName',
        'status'
    ]);
    try {
        const videoUpdate: LeanDocument<IVideo> = await Video.findOneAndUpdate({ _id: req.params.id }, updateValue, { new: true });
        res.send(videoUpdate)
    } catch (error) {
        res.status(404).send(`video with id: ${req.params.id} cant find`);
    }


};

export const addVideo = async (req: Request, res: Response) => {
    const newVideo: Partial<IVideo> = _.pick(req.body, [
        'uploader',
        'title',
        'description',
        'videoPath',
        'duration',
        'thumbnail',
        'jsonPath',
        'optimalGraphPath',
        'twoLineGraphPath',
        'physioVideoId',
        'score',
        'isPatient'
    ]);

    if (newVideo.isPatient && !newVideo.physioVideoId) {
        res.status(400).send('Patient\'s video must a "physioVideoId" field');
    }

    let video = new Video(req.body);
    try {
        const newVideo: IVideo = await video.save();
        res.send(newVideo);
    } catch (error) {
        res.status(400).send(error);
    }
};