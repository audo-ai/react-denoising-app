import { Row, Card } from 'antd';


export const Library = ({ recordings }) => {
    return (
        <div>
            <p>My Recordings</p>
            { recordings.length == 0 ?
                <EmptyLibraryCard />
                :
                recordings.slice(0).reverse().map((cleanRecording, index) => {
                    return <AudioCard key={index} cleanRecording={cleanRecording} count={recordings.length - index} />
                })
            }
        </div>
    );
}

const AudioCard = ({ cleanRecording, count }) => {
    return (
        <Row
            gutter={4}
            style={{ width: "100%" }}
            justify="center"
            align="middle">
            <Card bordered={true} style={{ backgroundColor: "#141414", color: "white", borderColor: "#272727", width: 400, padding: 0, marginBottom: 15, textAlign: "left" }}>
                <p>{"Recording " + count}</p>
                <audio style={{ width: "100%" }} src={cleanRecording} controls="controls" />
            </Card>
        </Row>
    )
}

const EmptyLibraryCard = () => {
    return (
        <Row
            gutter={4}
            style={{ width: "100%" }}
            justify="center"
            align="middle">
            <Card bordered={true} style={{ backgroundColor: "#141414", color: "white", borderColor: "#272727", width: 400, marginBottom: 15, textAlign: "left" }}>
                <p style={{ margin: "0" }}>You currently do not have any recordings.</p>
            </Card>
        </Row>
    )
}
