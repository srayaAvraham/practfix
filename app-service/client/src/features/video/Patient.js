import { useSelector } from 'react-redux';
import { Player } from './Player';
import { UploadVideo } from './Upload';
import { currentVideo } from './videoSlice';

export const Patient = () => {
    const current = useSelector(currentVideo);
    debugger
    if(current){
        return current.patient ? 
        <Player url={current.patient.videoPath}/> :
        <UploadVideo/>
    } else {
        return;
    }
}