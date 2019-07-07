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
import { BreadthFirstSearch, DijkstraSearch, BestFirstSearch, Node, PriorityNode, AStarSearch } from "./search-path";

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
        this.resetMap();
        // this.createBFSMap();
        // this.createDijkstraMap();
        // this.createBestSearchMap();


        // this.testBreadthFirstSearch();
        // this.testDijkstraSearch();
        // this.testBestFirstSearch();
        // this.testAStarSearch();
    }

    resetMap() {
        this.map_arr = [
            [1, 1, 1, 1, 99, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 999, 999, 999, 999, 999, 999, 999, 999, 999, 1],
            [1, 1, 1, 1, 99, 1, 1, 1, 1, 1, 1, 999, 1],
            [99, 99, 99, 99, 99, 99, 99, 1, 1, 1, 1, 999, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 999, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 999, 1],
            [51, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 999, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 999, 1],
            [1, 17, 1, 1, 1, 1, 1, 1, 1, 1, 1, 999, 1],
            [1, 1, 888, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 999, 999, 999, 999, 999, 999, 999, 999, 999, 1],
            [1, 1, 1, 71, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        this.node_arr = JSON.parse(JSON.stringify(this.map_arr));
        let gap = 4;
        for (let y = 0; y < this.map_arr.length; y++) {
            for (let x = 0; x < this.map_arr[0].length; x++) {
                let square: cc.Node = cc.instantiate(this.squareTemplat);
                square.parent = this.node;
                square.getChildByName('priority').getComponent(cc.Label).string = this.map_arr[y][x].toString();
                square.x = x * (square.width + gap) + square.width / 2;
                square.y = -y * (square.height + gap) - square.height / 2;
                this.node_arr[y][x] = square;
                if (this.map_arr[y][x] == 999) {
                    square.color = cc.Color.BLACK;
                    square.getChildByName('arrow').destroy();
                } else {
                    square.color = cc.Color.WHITE;
                }
            }
        }
    }

    testAStarSearch() {
        let astar = new AStarSearch(this.map_arr);
        console.time('cost time: ');
        let result = astar.searchPath(new Node(6, 5), new Node(12, 0));
        console.timeEnd('cost time: ');
        this.showPathResult(result);
    }

    testBestFirstSearch() {
        let bfs = new BestFirstSearch(this.map_arr);
        console.time('cost time: ');
        let result = bfs.searchPath(new Node(6, 5), new Node(12, 0));
        console.timeEnd('cost time: ');
        this.showPathResult(result);
    }

    testDijkstraSearch() {
        let dijkstra = new DijkstraSearch(this.map_arr);
        console.time('cost time: ');
        let result = dijkstra.searchPath(new Node(6, 5), new Node(12, 0));
        console.timeEnd('cost time: ');
        this.showPathResult(result);
    }

    testBreadthFirstSearch() {
        let bfs = new BreadthFirstSearch(this.map_arr);
        console.time('cost time: ');
        let result = bfs.searchPath(new Node(6, 5), new Node(12, 0));
        console.timeEnd('cost time: ');
        this.showPathResult(result);
    }

    showPathResult(result) {
        let path: Array<Node> = result.path;
        let visit: Array<PriorityNode> = result.visitHistory;
        let searchRecord: any = result.searchRecord;
        let _timer = setInterval(() => {
            if (visit.length) {
                let pnode = visit.shift();
                let node = this.node_arr[pnode.node.y][pnode.node.x];
                let c = node.color;
                c.setB(c.getB() - 50);
                c.setG(c.getG() - 50);
                c.setR(c.getR() - 50);
                node.color = c;
                // node.getChildByName('priority').getComponent(cc.Label).string = pnode.priority.toString();
            } else {
                clearInterval(_timer);
                for (let node of path) {
                    this.node_arr[node.y][node.x].color = cc.Color.GREEN;
                }
                for(let key in searchRecord){
                    // console.log(key, searchRecord[key]);
                    let xy = key.split('_');
                    let node = this.node_arr[parseInt(xy[1])][parseInt(xy[0])];
                    let rotation = this.calcDirection(cc.v2(parseInt(xy[0]), parseInt(xy[1])), cc.v2(searchRecord[key].x, searchRecord[key].y));
                    // node.getChildByName('arrow').active = true;
                    node.getChildByName('arrow').rotation = rotation;
                }
            }
        }, 30);
    }

    calcDirection(parent: cc.Vec2, child: cc.Vec2){
        let direction = parent.sub(child);

        let left = cc.v2(1, 0);
        let right = cc.v2(-1, 0);
        let up = cc.v2(0, -1);
        let down = cc.v2(0, 1);
        let rotation = 0;
        if(direction.toString() == left.toString()){
            rotation = 180;
        }else if(direction.toString() == right.toString()){
            rotation = 0;
        }else if(direction.toString() == up.toString()){
            rotation = 90;
        }else if(direction.toString() == down.toString()){
            rotation = -90;
        }
        return rotation;
        //left(-1, 0), right(1, 0), up(1, 0), down(-1, 0)
    }
}
