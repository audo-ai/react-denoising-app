import MicRecorder from 'mic-recorder-to-mp3';
import { Button, message } from 'antd';
import { AudioOutlined, BorderOutlined, LoadingOutlined } from '@ant-design/icons';


const API_URL = "https://api.audo.ai/v1";
const API_KEY = "<SET YOUR API KEY HERE>";
const Mp3Recorder = new MicRecorder({ bitRate: 128 });


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
            removeBackgroundNoise(blob, setRecordingState, setRecordings, recordings);
        });
};

const removeBackgroundNoise = (audioBlob, setRecordingState, setRecordings, recordings) => {
    let form = new FormData();
    form.append("file", audioBlob, "enhanced_recording.mp3");

    fetch(API_URL + "/upload?inputExt=mp3", {
        method: "POST",
        headers: { "x-api-key": API_KEY },
        body: form
    })
        .then((response) => response.json())
        .then((data) => {
            fetch(
                API_URL + "/remove-noise", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "x-api-key": API_KEY
                },
                body: JSON.stringify({ input: data.fileId }),
                credentials: 'include'
            })
                .then(r => r.json()).then(r => {
                    setTimeout(onLoading(r.jobId, onFinished, setRecordingState, setRecordings, recordings), 0);
                });
        }).catch((e) => console.log(e));
};

const onLoading = (jobId, onFinished, setRecordingState, setRecordings, recordings) => {
    fetch(
        API_URL + `/remove-noise/${jobId}/status`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            "x-api-key": API_KEY
        },
        credentials: 'include'
    })
        .then(r => r.json()).then(r => {

            if (r.state == "failed") {
                setRecordingState("Not Recording");
                message.error("Oops! Something went wrong!")
            } else if (r.state != "succeeded") {
                setRecordingState("Loading");
                setTimeout(function () {
                    onLoading(jobId, onFinished, setRecordingState, setRecordings, recordings);
                }, 400);
            } else {
                onFinished(API_URL + r.downloadPath, setRecordingState, setRecordings, recordings);
            }
        });
};

const onFinished = (processedAudio, setRecordingState, setRecordings, recordings) => {
    recordings.push(processedAudio);
    setRecordings(recordings);
    setRecordingState("Not Recording");
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
            return <div></div>;

    }
};
