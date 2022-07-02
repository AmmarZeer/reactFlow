import React,{useState} from 'react'
import Sidebar from './Sidebar';

export default function AppOptions(props) {
    const [expandApps, setExpandApps] = useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "row",}}>
      <button
        style={{ width: "100%", background: "skyblue", }}
        onClick={() => {
          setExpandApps(!expandApps);
        }}
      >
        {props.category}
      </button>
      {expandApps ? <Sidebar /> : null}
    </div>
  );
}
