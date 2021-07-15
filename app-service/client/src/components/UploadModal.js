import React, { useState } from 'react';
import { Modal, Form, Input, Radio, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { addVideo } from '../features/video/videoSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import { userSelector } from "../features/user/userSlice";

export const UploadModal = ({ visible, onCreate, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const user = useSelector(userSelector);
  const handleUpload = ({ fileList }) => {
    //---------------^^^^^----------------
    // this is equivalent to your "const img = event.target.files[0]"
    // here, antd is giving you an array of files, just like event.target.files
    // but the structure is a bit different that the original file
    // the original file is located at the `originFileObj` key of each of this files
    // so `event.target.files[0]` is actually fileList[0].originFileObj
    console.log('fileList', fileList);

    // you store them in state, so that you can make a http req with them later
    setSelectedFile(fileList);
  };

  const handleSubmission = (values) => {
    setConfirmLoading(true)
    const formData = new FormData();

    formData.append('myFile', selectedFile[0].originFileObj);
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('user', user.id);

    fetch(
      'http://localhost:5000/upload',
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((result) => {
        setConfirmLoading(false)
        dispatch(addVideo(result.doc))
        console.log('Success:', result);
      })
      .catch((error) => {
        console.error('Error:', error);
      }).finally(() => {
        form.resetFields();
      });
  };
  return (
    <Modal
      visible={visible}
      title="Upload new video"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      cancelButtonProps={{ disabled: true }}
      confirmLoading={confirmLoading}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            handleSubmission(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item label="Dragger">
          <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={handleUpload} noStyle rules={[
            // {
            //   required: true,
            //   message: 'Please upload video!',
            // },
          ]}>
            <Upload.Dragger maxCount={1} name="files" beforeUpload={() => false}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for a single or bulk upload.</p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};