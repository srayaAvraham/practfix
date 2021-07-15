import { useSelector } from 'react-redux';
import { currentVideo } from './videoSlice';
import { Player } from './Player';

export const Expert = ({ url }) => {
    const current = useSelector(currentVideo);
    return (<div>
<Player url={current.videoPath} />
    </div>
            
    )
}