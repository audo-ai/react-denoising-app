import { Component, useState, useEffect, useRef } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import { Library } from './Library';
import axios from 'axios';
import { Button, Radio, message } from 'antd';
import { AudioOutlined, BorderOutlined, LoadingOutlined } from '@ant-design/icons';
import { Row, Col, Space } from 'antd';
import { RecordingButton } from './RecordingButton';
import socketIOClient from "socket.io-client";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const API_URL = "https://api.audo.ai/v1";

export const Recorder = () => {
    const [recordings, setRecordings] = useState([]);
    const [recordingState, setRecordingState] = useState("Not Recording");
    const [isBlocked, setBlocked] = useState(false);

    console.log(recordings);

    useEffect(() => {
        navigator.getUserMedia({ audio: true },
            () => {
                console.log('Permission Granted');
                setBlocked(false);
            },
            () => {
                console.log('Permission Denied');
                setBlocked(true);
            },
        );
    });

    return (
        <Row>
            <Col span={3}></Col>
            <Col span={18}>
                <div align="center">
                    <RecordingButton
                        recordingState={recordingState}
                        isBlocked={isBlocked}
                        setRecordingState={setRecordingState}
                        setRecordings={setRecordings}
                        recordings={recordings} />
                    <Library recordings={recordings} />
                </div>
            </Col>
            <Col span={3}></Col>
        </Row>
    );

};