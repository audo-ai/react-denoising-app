import { Component, useState, useEffect, useRef } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import { Library } from './Library';
import axios from 'axios';
import { Button, Radio, message } from 'antd';
import { AudioOutlined, BorderOutlined, LoadingOutlined } from '@ant-design/icons';
import { Row, Col, Space } from 'antd';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useInterval } from "../hooks/useInterval"

import socketIOClient from "socket.io-client";

const API_URL = "https://api.audo.ai/v1";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });


const onFinished = (processedAudio, setRecordingState, setRecordings, recordings) => {
    recordings.push(processedAudio);
    setRecordings(recordings);
    setRecordingState("Not Recording");
}

const onLoading = (jobId, onFinished, setRecordingState, setRecordings, recordings) => {

    fetch(
        API_URL + `/remove-noise/${jobId}/status`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            "x-api-key": "f5bdc8b1354a0c87134203fad2c379eb"
        },
        credentials: 'include'
    })
        .then(r => r.json()).then(r => {
            console.log(r);
            if (r.state != "succeeded") {
                setRecordingState("Loading");
                setTimeout(function () {
                    onLoading(jobId, onFinished, setRecordingState, setRecordings, recordings);
                }, 400);
            } else {
                onFinished(API_URL + r.downloadPath, setRecordingState, setRecordings, recordings)
            }
        });



}

// const onLoading = (jobId, onFinished, setRecordingState, setRecordings, recordings) => {
//     const backendUrl = new URL(API_URL);
//     var socket = socketIOClient(backendUrl.origin, {
//         path: backendUrl.pathname.replace(/\/+$/, "") + `/ws/socket.io`,
//         query: { jobId },
//         headers: { "x-api-key": "f5bdc8b1354a0c87134203fad2c379eb" },
//     });

//     var succeeded = false;
//     socket.on("queued", (message) => {
//         setRecordingState("Loading");
//     });
//     socket.on("progress", (message) => {
//         setRecordingState("Loading");
//     });
//     socket.on("succeeded", ({ processedFull }) => {
//         succeeded = true;
//         onFinished(processedFull, setRecordingState, setRecordings, recordings);
//     });
//     socket.on("disconnect", () => {
//         if (!succeeded) {
//             message.error("Some error occured!");
//         }
//     });

//     return () => socket.disconnect();
// };

const start = (isBlocked, setRecordingState) => {
    if (isBlocked) {
        console.log('Permission Denied');
    } else {
        Mp3Recorder
            .start()
            .then(() => {
                setRecordingState("Recording");
            }).catch((e) => console.error(e));
    }
};

const stop = (setRecordingState, setRecordings, recordings) => {
    Mp3Recorder
        .stop()
        .getMp3()
        .then(([buffer, blob]) => {
            let form = new FormData();
            form.append("file", blob, "enhanced_recording.mp3");

            fetch(API_URL + "/upload?inputExt=mp3", {
                method: "POST",
                headers: { "x-api-key": "f5bdc8b1354a0c87134203fad2c379eb" },
                body: form
            })
                .then((response) => response.json())
                .then((data) => {
                    fetch(
                        API_URL + "/remove-noise", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            "x-api-key": "f5bdc8b1354a0c87134203fad2c379eb"
                        },
                        body: JSON.stringify({ input: data.fileId }),
                        credentials: 'include'
                    })
                        .then(r => r.json()).then(r => {
                            setTimeout(onLoading(r.jobId, onFinished, setRecordingState, setRecordings, recordings), 0);
                        });
                }).catch((e) => console.log(e));
        });
};


export const RecordingButton = ({ recordingState, setRecordingState, setRecordings, recordings, isBlocked }) => {
    switch (recordingState) {
        case "Recording":
            return <Button
                type="primary"
                onClick={() => stop(setRecordingState, setRecordings, recordings)}
                shape="circle" icon={<BorderOutlined style={{ fontSize: '30px' }} />}
                style={{ width: '80px', height: '80px', margin: 50 }}
                size={"large"} />;
        case "Not Recording":
            return <Button
                type="primary"
                onClick={() => start(isBlocked, setRecordingState)}
                shape="circle" icon={<AudioOutlined style={{ fontSize: '30px' }} />}
                style={{ width: '80px', height: '80px', margin: 50 }}
                size={"large"} />;
        case "Loading":
            return <LoadingOutlined style={{ margin: 50 }} />;
        default:
            return <div></div>

    }
};
