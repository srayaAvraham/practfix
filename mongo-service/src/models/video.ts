import mongoose, { model, Schema, Model, Document } from "mongoose";

interface IVideo extends Document {
  uploader: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoPath: string;
  duration: string;
  thumbnail: string;
  jsonPath: string;
  optimalGraphPath: string;
  twoLineGraphPath: string;
  physioVideoId: string;
  score: string;
  isPatient: Boolean;
  status: string;
}

const videoSchema: Schema = new Schema(
  {
    uploader: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    title: {type: String, required: true, maxlength: 20, trim: true},
    description: {type: String, trim: true},
    videoPath: {type: String, unique: true, sparse: true},
    duration: { type: String, required: true, trim: true },
    thumbnail: {type: String, unique: true, sparse: true},
    jsonPath: {type: String, unique: true, sparse: true},
    optimalGraphPath: {type: String, unique: true, sparse: true},
    twoLineGraphPath: {type: String, unique: true, sparse: true},
    physioVideoId: {type: mongoose.Types.ObjectId, ref: 'Video', index: true},
    score: {type: Number},
    status: {type: String, default: 'panding'},
    isPatient: {type: Boolean, required: true},
  },
  { timestamps: true,
    toJSON: {
      transform: (doc: Document, obj: IVideo) => {
        delete obj.__v;
        return obj;
      },
    }
  }
);

const Video: Model<IVideo> = model("Video", videoSchema);

export {Video, IVideo}