type User = {
    id: string,
    email: string;
    name: string;
    userName: string;
    password: string;
  }

type Video =  {
    uploader: string;
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

  export {
      User,
      Video
  }