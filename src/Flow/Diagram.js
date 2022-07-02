import React, { useState, useRef, useCallback,useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from 'react-flow-renderer';

import CustomGroupNode from './customGroupNode';
import '../index.css'
import AppOptions from './AppOptions';

const initialNodes = [
  {
    id: 'A',
    type: 'groupFrame',
    data: { label: "Group1" },
    position: { x: 0, y: 0 },
    // style: {
    //   width: 170,
    //   height: 140,
    // },
  },
  // {
  //   id: 'B',
  //   type: 'input',
  //   data: { label: 'child node 1' },
  //   position: { x: 10, y: 10 },
  //   parentNode: 'A',
  //   extent: 'parent',
  //   expandParent:true
  // },
  // {
  //   id: 'C',
  //   data: { label: 'child node 2' },
  //   position: { x: 10, y: 90 },
  //   parentNode: 'A',
  //   extent: 'parent',
  //   expandParent:true
  // },
  // {
  //   id: 'AA',
  //   type: 'group',
  //   data: { label: null },
  //   position: { x: 200, y: 0 },
  //   style: {
  //     width: 170,
  //     height: 140,
  //   },
  // },
  // {
  //   id: 'BB',
  //   type: 'input',
  //   data: { label: 'child node 1' },
  //   position: { x: 10, y: 10 },
  //   parentNode: 'AA',
  //   extent: 'parent',
  //   expandParent:true
  // },
  // {
  //   id: 'CC',
  //   data: { label: 'child node 2' },
  //   position: { x: 10, y: 90 },
  //   parentNode: 'AA',
  //   extent: 'parent',
  // },
];

const categories=[ "OXAGON","T&D", "Other NEOM Entities","3rd Party Owned","Hardware","OpenPlatform"]

let id = 0;
const getId = () => `dndnode_${id++}`;

export default function Diagram() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [expandCategory, setExpandCategory] = useState(false)
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const nodeTypes = useMemo(() => ({ groupFrame: CustomGroupNode }), []);


  const onConnect = useCallback((params) => setEdges((eds) => addEdge({...params,type:'step'}, eds)), [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  const isDropedOnAGroupNode = (pos)=>{
    //console.log('=======',nodes)
    let parentNode=null
    nodes.some(node=>{
      if(node.type==="groupFrame"){
        console.log(node)
        if (
          pos.x >= node.position.x &&
          pos.x <= node.position.x + node.width &&
          pos.y >= node.position.y &&
          pos.y <= node.position.y + node.height
        ) {
          console.log("inside");
          parentNode = node;
          return true;
        }
      }
    })
    return parentNode
    //return false
    //console.log(pos)

  }
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      let newNode = {
        id: getId(),
        type,
        position,
        style:{backgroundColor:type==='input'?'red':type==='output'?'blue':'yellow'},
        data: { label: `${type} node` },
      };

      let parentNode=isDropedOnAGroupNode(position)

      if(parentNode){
        newNode = {...newNode,
          parentNode:parentNode.id,
          expandParent:true,
          extent:'parent'
          //extent:[[parentNode.position.x,parentNode.width+100],[parentNode.position.y,parentNode.height+100]],

        }
        console.log(newNode)
      }
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance,nodes]
  );
console.log(nodes)
  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div style={{ height: "5vh", width: "10%" }}>
          <button
            style={{ width: "100%", marginBottom: "5px"}}
            onClick={() => {
              setExpandCategory(!expandCategory);
            }}
          >
            Apps &#62;
          </button>
          {expandCategory
            ? categories.map((category) => (
                <AppOptions key={category} category={category}/>
              ))
            : null}
        </div>
        <div><button onClick={()=>console.log(reactFlowInstance.getNodes())}>toObject</button></div>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            connectionMode='loose'
          >
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

