import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../features/user/userSlice";
import { currentVideo, getPatientVideo } from "../video/videoSlice";
const { Dragger } = Upload;

export const UploadVideo = () => {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const current = useSelector(currentVideo);
  const props = {
    name: 'myFile',
    multiple: false,
    action: `http://localhost:5000/upload/${current._id}/${user._id}`,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        dispatch(getPatientVideo({id:current._id, userId: user.id }))
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
    return(
        <Dragger {...props} maxCount={1}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or other
          band files
        </p>
      </Dragger>
    )

}