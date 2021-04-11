import { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { RecordingButton } from './RecordingButton';
import { Library } from './Library';

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