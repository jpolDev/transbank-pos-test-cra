import { useState } from "react";

import POS from "transbank-pos-sdk-web";

import logo from "./logo.svg";
import "./App.css";

function App() {
  const [agentConnected, setAgentConnected] = useState(false);
  const [posConnected, setPosConnected] = useState(false);
  const [activePort, setActivePort] = useState("");

  const handleTestConnection = async () => {
    try {
      // POS.socket().on('disconnect', () => {
      //     swal("Se perdió la conexión con el Agente", "Verifique que el agente se haya inicializado en este computador", "error");
      // })

      // eslint-disable-next-line no-undef
      POS.on("socket_connected", () => {
        setAgentConnected(true);
      });

      POS.on("socket_disconnected", () => {
        setAgentConnected(false);
      });

      POS.on("port_opened", (port) => {
        setPosConnected(true);
        setActivePort(port);
      });

      POS.on("port_closed", () => {
        setPosConnected(false);
        setActivePort("");
      });

      await POS.connect();

      let response = await POS.getPortStatus();
      setPosConnected(response.connected);
      setActivePort(response.activePort);

      // POSsocket().on('connect', () => {
      //     swal("Se recuperó la conexión con el Agente", "", "success");
      // })
    } catch (e) {
      console.error("Conexión con el agente fallida: ", e);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <ul style={{ textAlign: "left" }}>
          <li>
            <strong>Conexión agente:</strong>
            <span>{" " + agentConnected}</span>
          </li>
          <li>
            <strong>Conexión dispositivo:</strong>
            <span>{" " + posConnected}</span>
          </li>
          <li>
            <strong>Puerto:</strong>
            <span>{" " + activePort}</span>
          </li>
        </ul>
        <button onClick={handleTestConnection}>Test connection</button>
      </header>
    </div>
  );
}

export default App;
