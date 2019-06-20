// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//astar search article
//https://www.redblobgames.com/pathfinding/a-star/introduction.html
import { BreadthFirstSearch, DijkstraSearch, BestFirstSearch, Node, PriorityNode, AStarSearch} from "./search-path";

const { ccclass, property } = cc._decorator;

class MapNode {
    x: number;
    y: number;
    cost: number;
    constructor(position: cc.Vec2, cost: number = 0) {
        this.x = position.x;
        this.y = position.y;
        this.cost = cost;
    }

    toString() {
        return `${this.x}_${this.y}`;
    }

    getVec2() {
        return cc.v2(this.x, this.y);
    }

    getCost() {
        return this.cost;
    }
}

@ccclass
export default class NewClass extends cc.Component {

    @property({
        type: cc.Prefab
    })
    squareTemplat: cc.Prefab = null;

    map_arr: Array<Array<number>> = [];
    node_arr: Array<Array<cc.Node>> = [];
    // onLoad () {}

    start() {
        this.map_arr = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 999, 999, 999, 999, 999, 999, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 999, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 999, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 999, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 999, 1],
            [51, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 999, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 999, 1],
            [1, 17, 1, 1, 1, 1, 1, 1, 1, 1, 1, 999, 1],
            [1, 1, 888, 1, 1, 1, 1, 1, 1, 1, 1, 999, 1],
            [1, 1, 1, 999, 999, 999, 999, 999, 999, 999, 999, 999, 1],
            [1, 1, 1, 71, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        this.node_arr = JSON.parse(JSON.stringify(this.map_arr));
        let gap = 4;
        for (let y = 0; y < this.map_arr.length; y++) {
            for (let x = 0; x < this.map_arr[0].length; x++) {
                let square: cc.Node = cc.instantiate(this.squareTemplat);
                square.parent = this.node;
                square.x = x * (square.width + gap) + square.width / 2;
                square.y = -y * (square.height + gap) - square.height / 2;
                this.node_arr[y][x] = square;
                if(this.map_arr[y][x] == 999){
                    square.color = cc.Color.BLACK;
                }
            }
        }
        // this.createBFSMap();
        // this.createDijkstraMap();
        // this.createBestSearchMap();


        this.testBreadthFirstSearch();
        // this.testDijkstraSearch();
        // this.testBestFirstSearch();
        // this.testAStarSearch();
    }

    testAStarSearch(){
        let astar = new AStarSearch(this.map_arr);
        console.time('cost time: ');
        let result = astar.searchPath(new Node(5, 5), new Node(12, 0));
        console.timeEnd('cost time: ');
        this.showPathResult(result);
    }

    testBestFirstSearch(){
        let bfs = new BestFirstSearch(this.map_arr);
        console.time('cost time: ');
        let result = bfs.searchPath(new Node(5, 5), new Node(12, 0));
        console.timeEnd('cost time: ');
        this.showPathResult(result);
    }

    testDijkstraSearch(){
        let dijkstra = new DijkstraSearch(this.map_arr);
        console.time('cost time: ');
        let result = dijkstra.searchPath(new Node(5, 5), new Node(12, 0));
        console.timeEnd('cost time: ');
        this.showPathResult(result);
    }

    testBreadthFirstSearch(){
        let bfs = new BreadthFirstSearch(this.map_arr);
        console.time('cost time: ');
        let result = bfs.searchPath(new Node(5,5), new Node(12, 0));
        console.timeEnd('cost time: ');
        this.showPathResult(result);
    }

    showPathResult(result){
        let path: Array<Node> = result.path;
        let visit: Array<PriorityNode> = result.visitHistory;
        let _timer = setInterval(() => {
            if(visit.length){
                let pnode = visit.shift();
                let node = this.node_arr[pnode.node.y][pnode.node.x];
                let c = node.color;
                c.setB(c.getB() - 50);
                c.setG(c.getG() - 50);
                c.setR(c.getR() - 50);
                node.color = c;
                node.getChildByName('priority').getComponent(cc.Label).string = pnode.priority.toString();
            }else{
                clearInterval(_timer);
                for(let node of path){
                    this.node_arr[node.y][node.x].color = cc.Color.GREEN;
                }
            }
        }, 30);
    }

    createBestSearchMap(){
        this.map_arr = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 999, 999, 999, 999, 999, 999, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 999, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 999, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 999, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 999, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 999, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 999, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 999, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 999, 0],
            [0, 0, 0, 999, 999, 999, 999, 999, 999, 999, 999, 999, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        for (let y = 0; y < this.map_arr.length; y++) {
            for (let x = 0; x < this.map_arr[0].length; x++) {
                
                if(this.map_arr[y][x] == 999){
                    this.node_arr[y][x].color = cc.Color.BLACK;
                }else{
                    this.map_arr[y][x] = 1;
                }
            }
        }
        let start = cc.v2(1, 10);
        let end = cc.v2(this.map_arr[0].length - 1, 1);

        this.node_arr[start.y][start.x].color = cc.Color.RED;
        this.node_arr[end.y][end.x].color = cc.Color.RED;

        // this.bestFirstSearch(start, end);
        this.aStartSearch(start, end);
    }

    aStartSearch(start, end){
        start = new MapNode(start);
        end = new MapNode(end);

        let costRecord = {};
        costRecord[start.toString()] = 0;
        let visitRecord = {};
        visitRecord[start.toString()] = null;
        let visitHistory = [];
        let _getAStarPriority = (start, end) => {
            let _cost = costRecord[start];
            let _distance = this._getDistance(start.getVec2(), end.getVec2());

            return _cost + _distance;
        }
        let searchQueue = [{node: start, priority: _getAStarPriority(start, end)}];
        let _insertToQueue = (node, priority) => {
            for(let i = 0; i < searchQueue.length; i++){
                if(priority <= searchQueue[i].priority){
                    return searchQueue.splice(i, 0, {node: node, priority: priority});
                }
            }
            searchQueue.push({node: node, priority: priority});
        }
       
        while(searchQueue.length){
            let current = searchQueue.shift();
            if(current.node.toString() == end.toString()){
                break;
            }
            let neighbors = this.getBFSNeighbors(current.node);
            for(let node of neighbors){
                let cost = costRecord[current.node] + node.getCost();
                if(visitRecord[node.toString()] === undefined || cost < visitRecord[node.toString()]){
                    costRecord[node.toString()] = cost;
                    visitRecord[node.toString()] = current.node;
                    _insertToQueue(node, _getAStarPriority(node, end));
                }
            }
            let _temp = [];
            for(let key in visitRecord){
                let raw = key.split('_');
                _temp.push(cc.v2(
                    parseInt(raw[0]),
                    parseInt(raw[1])
                ));
            }
            visitHistory.push(_temp);
        }

        let path = [end];
        while(visitRecord[path[0]]){
            path.unshift(visitRecord[path[0]]);
        }

        let _handler = setInterval(() => {
            let posArr = visitHistory.shift();
            if(posArr){
                for(let pos of posArr){
                    this.node_arr[pos.y][pos.x].color = cc.Color.BLUE;
                    // this.node_arr[pos.y][pos.x].getChildByName('priority').getComponent(cc.Label).string = costRecord[`${pos.y}_${pos.x}`];
                }
                
            }else{
                clearInterval(_handler);
                for(let node of path){
                    this.node_arr[node.y][node.x].color = cc.Color.GREEN;
                    
                }
            }
        }, 50);
    }

    _getDistance(start: cc.Vec2, end: cc.Vec2){
        // let pow = Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2)
        // return Math.sqrt(pow);
        return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
    }

    bestFirstSearch(start, end) {
        start = new MapNode(start);
        end = new MapNode(end);
        let searchQueue = [{node: start, priority: this._getDistance(start, end)}];
        let insertToQueue = (node, priority) => {
            for(let i = 0; i < searchQueue.length; i++){
                if(priority < searchQueue[i].priority){
                    return searchQueue.splice(i, 0, {node: node, priority: this._getDistance(node, end)});
                }
            }
            searchQueue.push({node: node, priority: this._getDistance(node, end)});
        }
        let searchRecord = {}
        searchRecord[start.toString()] = null;
        let visitHistory = [];
        while(searchQueue.length){
            let current = searchQueue.shift();
            if(current.node.toString() == end.toString()){
                break;
            }
            let neighbors = this.getBFSNeighbors(current.node);
            for(let node of neighbors){
                if(searchRecord[node.toString()] === undefined){
                    insertToQueue(node, this._getDistance(node.getVec2(), end.getVec2()));
                    searchRecord[node.toString()] = current.node;
                }
            }
            let _temp = [];
            for(let key in searchRecord){
                let raw = key.split('_');
                _temp.push(cc.v2(
                    parseInt(raw[0]),
                    parseInt(raw[1])
                ));
            }
            visitHistory.push(_temp);
        }

        let path = [end];

        while(searchRecord[path[0]]){
            path.unshift(searchRecord[path[0]]);
        }

        let _handler = setInterval(() => {
            let posArr = visitHistory.shift();
            if(posArr){
                for(let pos of posArr){
                    this.node_arr[pos.y][pos.x].color = cc.Color.BLUE;
                }
                
            }else{
                clearInterval(_handler);
                for(let node of path){
                    this.node_arr[node.y][node.x].color = cc.Color.GREEN;
                }
            }
        }, 50);

        
    }

    createDijkstraMap() {
        //set priority
        for (let y = 0; y < this.map_arr.length; y++) {
            for (let x = 0; x < this.map_arr[0].length; x++) {
                // this.map_arr[y][x] = Math.floor((Math.random() * 10) % 10);
                if(x != 0 && y != 11){
                    this.map_arr[y][x] = 99;
                }
                let _c = 255 - Math.floor(this.map_arr[y][x] * 25.5);
                this.node_arr[y][x].color = cc.color(_c, _c, _c, 255);
                this.node_arr[y][x].getChildByName('priority').color = cc.hexToColor('#05C242');
                this.node_arr[y][x].getChildByName('priority').getComponent(cc.Label).string = this.map_arr[y][x].toString();
            }
        }

        let start = cc.v2(0, 0);
        let end = cc.v2(this.map_arr[0].length - 1, this.map_arr.length - 1);
        this.node_arr[start.y][start.x].color = cc.Color.RED;
        this.node_arr[end.y][end.x].color = cc.Color.RED;

        this.dijkstraSeach(start, end);
    }

    getDijkstraNeighbors(tile: MapNode){
        let neighbors:Array<MapNode> = [];
        if(tile.y - 1 >= 0){
            let _temp = cc.v2(tile.x, tile.y - 1);
            neighbors.push(
                new MapNode(_temp, this.map_arr[_temp.y][_temp.x])
            );
        }
        if(tile.y + 1 < this.map_arr.length){
            let _temp = cc.v2(tile.x, tile.y + 1);
            neighbors.push(
                new MapNode(_temp, this.map_arr[_temp.y][_temp.x])
            );
        }
        if(tile.x - 1 >= 0){
            let _temp = cc.v2(tile.x - 1, tile.y);
            neighbors.push(
                new MapNode(_temp, this.map_arr[_temp.y][_temp.x])
            );
        }
        if(tile.x + 1 < this.map_arr[0].length){
            let _temp = cc.v2(tile.x + 1, tile.y);
            neighbors.push(
                new MapNode(_temp, this.map_arr[_temp.y][_temp.x])
            );
        }

        return neighbors;
    }

    dijkstraSeach(start, end){
        let searched_history = [];
        //优先级队列，从中选取优先级高的进行seach
        start = new MapNode(start);
        end = new MapNode(end);
        let priorityQueue = [{node: start, priority: 0}];
        function insertToQueue(node, priority){
            for(let i = 0; i < priorityQueue.length; i++){
                if(priority < priorityQueue[i].priority){
                    priorityQueue.splice(i, 0, {node: node, priority: priority});
                    return;
                }
            }
            priorityQueue.splice(priorityQueue.length, 0, {node: node, priority: priority});
        }
        let searchRecord = {}
        let costRecord = {}
        searchRecord[start.toString()] = null;
        costRecord[start.toString()] = 0;
        while(priorityQueue.length){
            let current = priorityQueue.shift();
            if(current.node.toString() == end.toString()){
                break;
            }
            let neighbors = this.getDijkstraNeighbors(current.node);
            for(let node of neighbors){
                let cost = node.cost + costRecord[current.node];
                if(costRecord[node.toString()] === undefined || cost < costRecord[node.toString()]){
                    insertToQueue(node, cost);
                    costRecord[node.toString()] = cost;
                    searchRecord[node.toString()] = current;
                }
            }

            //set searched node
            let _t = [];
            for (let key in searchRecord) {
                let _r = key.split('_');
                _t.push(new MapNode(cc.v2(parseInt(_r[0]), parseInt(_r[1]))));
            }
            searched_history.push(_t);
        }
        let path = [end];
        while(searchRecord[path[0]]){
            path.unshift(searchRecord[path[0]].node);
        }
        console.log(path);

        function showSearchedNode() {
            let timer = setInterval(() => {
                if (searched_history.length) {
                    let _arr = searched_history.shift();
                    for (let node of _arr) {
                        this.node_arr[node.y][node.x].color = cc.Color.GRAY;
                    }
                } else {
                    clearInterval(timer);
                    showFinalPath.apply(this);
                }
            }, 100);
        }

        function showFinalPath() {
            console.log('FindPath');
            // //set final path to green
            let timer = setInterval(() => {
                if (path.length) {
                    let node = path.shift();
                    this.node_arr[node.y][node.x].color = cc.Color.GREEN;
                } else {
                    clearInterval(timer);
                }
            }, 30);
        }
        showSearchedNode.apply(this);
    }

    createBFSMap() {

        // add block
        for (let y = 0; y < this.map_arr.length; y++) {
            for (let x = 0; x < this.map_arr[0].length; x++) {
                if(this.map_arr[y][x] == 999){
                    this.node_arr[y][x].color = cc.Color.BLACK;
                }
            }
        }
        //保证终点为0
        this.map_arr[11][17] = 0;
        let start = cc.v2(1, 10);
        let end = cc.v2(this.map_arr[0].length - 1, 1);
        this.node_arr[start.y][start.x].color = cc.Color.RED;
        this.node_arr[end.y][end.x].color = cc.Color.RED;
        this.bfsSearch(start, end);
    }

    getBFSNeighbors(tile: MapNode) {
        let neighbors: Array<MapNode> = [];
        //up
        if (tile.y - 1 >= 0 && this.map_arr[tile.y - 1][tile.x] != 999) {
            neighbors.push(new MapNode(cc.v2(tile.x, tile.y - 1), this.map_arr[tile.y - 1][tile.x]));
        }
        //down
        if (tile.y + 1 < this.map_arr.length && this.map_arr[tile.y + 1][tile.x] != 999) {
            neighbors.push(new MapNode(cc.v2(tile.x, tile.y + 1), this.map_arr[tile.y + 1][tile.x]));
        }
        //left
        if (tile.x - 1 >= 0 && this.map_arr[tile.y][tile.x - 1] != 999) {
            neighbors.push(new MapNode(cc.v2(tile.x - 1, tile.y), this.map_arr[tile.y][tile.x - 1]));
        }
        //right
        if (tile.x + 1 < this.map_arr[0].length && this.map_arr[tile.y][tile.x + 1] != 999) {
            neighbors.push(new MapNode(cc.v2(tile.x + 1, tile.y), this.map_arr[tile.y][tile.x + 1]));
        }
        return neighbors;
    }

    bfsSearch(startTile, endTile) {
        let startNode = new MapNode(startTile);
        let endNode = new MapNode(endTile);
        let search_list = [startNode];
        let search_record = {};

        let searched_history = [];
        search_record[startNode.toString()] = null;

        while (search_list.length) {
            let current = search_list.shift();
            if (current.toString() == endNode.toString()) {
                console.log('1111111111');
                break;
            }
            let neighbors = this.getBFSNeighbors(current);
            for (let neighbor of neighbors) {
                //null==undefined true
                if (search_record[neighbor.toString()] === undefined) {
                    search_record[neighbor.toString()] = current;
                    search_list.push(neighbor);
                }
            }
            //set searched node
            let _t = [];
            for (let key in search_record) {
                let _r = key.split('_');
                _t.push(new MapNode(cc.v2(parseInt(_r[0]), parseInt(_r[1]))));
            }
            searched_history.push(_t);
        }
        let path = [endNode];
        while (search_record[path[0].toString()]) {
            path.unshift(search_record[path[0].toString()]);
        }
        function showSearchedNode() {
            let timer = setInterval(() => {
                if (searched_history.length) {
                    let _arr = searched_history.shift();
                    for (let node of _arr) {
                        this.node_arr[node.y][node.x].color = cc.Color.GRAY;
                    }
                } else {
                    clearInterval(timer);
                    showFinalPath.apply(this);
                }
            }, 10);
        }

        function showFinalPath() {
            console.log('FindPath');
            // //set final path to green
            let timer = setInterval(() => {
                if (path.length) {
                    let node = path.shift();
                    this.node_arr[node.y][node.x].color = cc.Color.GREEN;
                } else {
                    clearInterval(timer);
                }
            }, 30);
        }
        showSearchedNode.apply(this);
    }
    // update (dt) {}
}
