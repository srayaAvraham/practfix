import { Result, Button } from 'antd';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import { currentVideo } from '../features/video/videoSlice';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import * as minio from "minio";

export const MyResult = () => {
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  const [mc, setMc] = useState([]);
  const { patient } = useSelector(currentVideo);

  useEffect(() => {
    const connectMinio = async () => {
      // create the client
      const mc = new minio.Client({
        endPoint: "localhost",
        port: 9000,
        useSSL: false,
        accessKey: "miniominio",
        secretKey: "miniominio"
      });
      setMc(mc);
    };
    connectMinio();
  }, []);

  const download = async (url) => {
    const name = url.substring(url.lastIndexOf('/') + 1)

    const filePath = url.split('/').splice(-2).join('/')
    console.log(filePath)
    setFetching(true);
    let size = 0
    let buf = []
    mc.getObject('practfix', filePath, function (err, dataStream) {
      if (err) {
        return console.log(err)
      }
      dataStream.on('data', function (chunk) {
        buf.push(chunk)
        size += chunk.length
      })
      dataStream.on('end', function () {
        console.log(buf)
        console.log('End. Total size = ' + size)
        const blobURL = URL.createObjectURL(new Blob(buf));
        const a = document.createElement("a");
        a.href = blobURL;
        a.style = "display: none";

        if (name && name.length) a.download = name;
        document.body.appendChild(a);
        a.click();
        console.log('End. Total size = ' + size)
      })
      dataStream.on('error', function (err) {
        console.log(err)
      })
    })
  }

  if (patient) {
    const { score, status } = patient
    if (score && status === "success") {
      return score > 100 ? <Result
        status="error"
        icon={<FrownOutlined />}
        title={`Sorry, please try again your score ${Math.round(score)}`}
        extra={<div><Button onClick={() => download(patient.optimalGraphPath)} >Download optimal graph</Button><Button onClick={() => download(patient.twoLineGraphPath)} >Download two line graph</Button></div>}
      /> : <Result
        icon={<SmileOutlined />}
        title={`Great, you did a good job your score ${Math.round(score)}`}
        extra={<div><Button onClick={() => download(patient.optimalGraphPath)} >Download optimal graph</Button><Button onClick={() => download(patient.twoLineGraphPath)} >Download two line graph</Button></div>}
      />
    } else if (status === "panding") {
      return <Result title="We are working on it, we will send you an email when we finish" />
    }
    return <Result
      status="error"
      title="Failed"
    // subTitle="Please check and modify the following information before resubmitting."
    />

  } else {
    return <Result
      title={`Upload video`}
    />
  }
}

