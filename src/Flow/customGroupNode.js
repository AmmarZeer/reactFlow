import { useCallback } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import '../index.css'
export default function CustomGroupNode({data}) {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
      }, []);
  return (
      <div className={'customGroupNode'}>
    <Handle type="source" position={Position.Top} id={'top'} />
    <Handle type="source" position={Position.Right} id={'right'} />
    <Handle type="source" position={Position.Left} id={'left'} />
    <Handle type="source" position={Position.Bottom} id={'bottom'} />
        <p>{data.label}</p>
    </div>
  )
}
