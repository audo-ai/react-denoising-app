import './App.css';
import 'antd/dist/antd.css';
import { Recorder } from './components/Recorder';
import { Layout } from 'antd';


const { Content } = Layout;

function App() {
  return (
    <div class="main-container">
      <Layout style={{ backgroundColor: "black", color: "white" }}>
        <Content>
          <Recorder />
        </Content>
      </Layout>

    </div>
  );
}

export default App;
