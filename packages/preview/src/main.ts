import './style.css';
import G6 from '@antv/g6';
import level1 from './data/level1.json';
import level2 from './data/level2.json';

console.log('G6', G6);
console.log('level1', level1);
console.log('level2', level2);

const edges = level1.resourcesSideList.map(i => ({
    ...i,
    label: i.type,
    labelCfg: {
        // position: 'bottom',

        style: {
            fill: 'cyan',
            opacity: 0.8,
            fontWeight: 400,
            // fontSize: 20,
        },
    },
    source: i.sourceUrl,
    target: i.targetUrl,
}));

const nodesByKey: Record<string, any> = {};
const nodes = [];

for (const node of level1.resourcesNodeList) {
    const newNode = {
        ...node,
        label: node.name ?? 'Sample Text',
        labelCfg: {
            // position: 'bottom',
            fontWeight: 400,
            style: {
                fill: '#666',
                opacity: 0.8,
            },
        },
        id: node.url,

    };
    nodesByKey[node.url] = newNode;
    nodes.push(newNode);
}

const data = {
    // 点集
    nodes, edges,
};

const graph = new G6.Graph({
    container: 'app', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
    width: window.innerWidth - 30, // Number，必须，图的宽度
    height: window.innerHeight - 30, // Number，必须，图的高度
    layout: {
        fitCenter: true,
        type: 'force',
        itemTypes: ['node', 'edge'],
        preventOverlap: true,
        linkDistance: 100,
        nodeSize: 20,
        // clustering: true,
        // clusterNodeStrength: -5,
        // clusterEdgeDistance: 200,
        // clusterNodeSize: 20,
        // clusterFociStrength: 1.2,
        // nodeSpacing: 5,
    },
    modes: {
        default: ['zoom-canvas', 'drag-canvas', 'drag-node'],
    },
});

graph.data(data); // 读取 Step 2 中的数据源到图上
graph.render(); // 渲染图

graph.on('node:dragstart', function (e) {
    graph.layout();
    refreshDragedNodePosition(e);
});
graph.on('node:drag', function (e) {
    const forceLayout = graph.get('layoutController').layoutMethods[0];
    forceLayout.execute();
    refreshDragedNodePosition(e);
});
graph.on('node:dragend', function (e) {
    e.item.get('model').fx = null;
    e.item.get('model').fy = null;
});

function refreshDragedNodePosition(e) {
    const model = e.item.get('model');
    model.fx = e.x;
    model.fy = e.y;
}
