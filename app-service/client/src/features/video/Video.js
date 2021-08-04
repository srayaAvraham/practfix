import { Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentVideo, getPatientVideo} from "./videoSlice";
import { userSelector } from "../../features/user/userSlice";
import { useEffect } from 'react';
const { Meta } = Card;

export const Video = ({video}) => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  useEffect(() => {

      dispatch(getPatientVideo({id:video._id, userId: user._id }))
    },[])

  const handleClick = (id) => {
      dispatch(setCurrentVideo(id))
      dispatch(getPatientVideo({id, userId: user._id }))
  }


    return (
        <Card
        onClick={() => {handleClick(video._id)}}
        style={{ width: '90%', height: '50%', margin: "auto", marginBottom: 15 }}
        cover={
          <img
          // style={{ width: '80%', }}
            alt="example"
            src={video.thumbnail}
          />
        }
      >
        <Meta
        //   avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={video.title}
          description={video.description}
        />
      </Card>
    )
}
