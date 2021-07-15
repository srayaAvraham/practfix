import { useSelector, useDispatch } from "react-redux";
import { List} from 'antd';
import { Video } from "./Video";
import { videoListSelector, videoListStatus, getVideos } from "./videoSlice";
import { useEffect } from "react";


export function VideoList() {
  const dispatch = useDispatch();

  const videoList = useSelector(videoListSelector);
  const videoStatus = useSelector(videoListStatus);


  useEffect(() => {
    console.log(videoStatus)
    if (videoStatus === 'idle') {
      console.log('fetch')
      dispatch(getVideos())
    }
  }, [videoStatus, dispatch]);

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={videoList}
        // loading={videoStatus}
        renderItem={item => (
          <Video video={item} />
        )}
      />
      {/* <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
        styleButton={
          {
            position: 'fixed',
            width: '300px',
            bottom: 0,
          }}
      >
        New Collection
      </Button>
      <UploadModal
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      /> */}
    </div>


  );
}