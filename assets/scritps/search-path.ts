const INFINITE = 999;

class Node{
    x: number;
    y: number;
    cost: number;
    constructor(x: number, y: number, cost: number = 1){
        this.x = x;
        this.y = y;
        this.cost = cost;
    }
    
    toString(){
        return `${this.x}_${this.y}`;
    }
}

class PriorityNode{
    node: Node;
    priority: number;

    constructor(node: Node, priority: number){
        this.node = node;
        this.priority = priority;
    }

    getNode(){
        return this.node;
    }
}

class PriorityQueue{
    queue: Array<PriorityNode>;
    constructor(){
        this.queue = [];
    }

    get length(){
        return this.queue.length;
    }

    put(node: Node, priority: number){
        let newNode = new PriorityNode(node, priority);
        for(let i = 0; i < this.queue.length; i++){
            if(priority <= this.queue[i].priority){
                return this.queue.splice(i, 0, newNode);
            }
        }
        this.queue.push(newNode);
    }

    get(){
        return this.queue.shift();
    }
}

class SearchBase{
    mapData: Array<Array<number>>;
    width: number;
    height: number;
    constructor(mapData: Array<Array<number>>){
        this.mapData = mapData;
        this.width = this.mapData[0].length;
        this.height = this.mapData.length;
    }

    _isBlock(cost: number){
        return cost == INFINITE;
    }

    _getCost(x: number, y: number){
        return this.mapData[y][x];
    }

    _genHistory(searchRecord: any, costRecord: any){
        let searchedNodeList: Array<PriorityNode> = [];
        for(let key in searchRecord){
            let raw = key.split('_');
            let node = new Node(parseInt(raw[0]), parseInt(raw[1]));
            let priority = costRecord[node.toString()] ? costRecord[node.toString()] : 0;

            searchedNodeList.push(new PriorityNode(
                node,
                priority
            ));
        }
        return searchedNodeList;
    }

    _genPath(end: Node, searchRecord: any){
        let path: Array<Node> = [end];
        while(searchRecord[path[0].toString()] instanceof Node){
            path.unshift(searchRecord[path[0].toString()]);
        }

        return path;
    }

    heuristics(start: Node, end: Node){
        return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
        // return Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2);
    }

    getNeighbors(node: Node){
        let neighbors: Array<Node> = [];

        let cost: number;
        if(node.x + 1 < this.width){
            cost =  this._getCost(node.x + 1, node.y);
            if(!this._isBlock(cost)){
                neighbors.push(
                    new Node(node.x + 1, node.y, cost)
                );
            }
        }

        if(node.x - 1 >= 0){
            cost =  this._getCost(node.x - 1, node.y);
            if(!this._isBlock(cost)){
                neighbors.push(
                    new Node(node.x - 1, node.y, cost)
                );
            }
        }

        if(node.y + 1 < this.height){
            cost =  this._getCost(node.x, node.y + 1);
            if(!this._isBlock(cost)){
                neighbors.push(
                    new Node(node.x, node.y + 1, cost)
                );
            }
        }

        if(node.y - 1 >= 0){
            cost =  this._getCost(node.x, node.y - 1);
            if(!this._isBlock(cost)){
                neighbors.push(
                    new Node(node.x, node.y - 1, cost)
                );
            }
        }

        return neighbors;
    }
}

class BreadthFirstSearch extends SearchBase{
    constructor(rawData: Array<Array<number>>){
        super(rawData);
    }

    searchPath(start: Node, end: Node){
        let searchQueue: Array<Node> = [start];
        let searchRecord = {}
        let costRecord = {}
        let visitHistory: Array<PriorityNode> = [];
        
        searchRecord[start.toString()] = true;
        while(searchQueue.length){
            let current = searchQueue.shift();
            if(current.toString() == end.toString()){
                break;
            }
            let neighbors = this.getNeighbors(current);
            for(let node of neighbors){
                if(!searchRecord[node.toString()]){
                    searchQueue.push(node);
                    searchRecord[node.toString()] = current;
                    visitHistory.push(new PriorityNode(node, 0));
                }
            }
        }

        return {
            path: this._genPath(end, searchRecord),
            visitHistory: visitHistory,
            searchRecord: searchRecord
        }
    }
}

class DijkstraSearch extends SearchBase{
    constructor(rawData: Array<Array<number>>){
        super(rawData);
    }

    searchPath(start: Node, end: Node){
        let searchQueue: PriorityQueue = new PriorityQueue();
        let searchRecord = {};
        let costRecord = {};
        let visitHistory: Array<PriorityNode> = [];

        searchQueue.put(start, 0);
        searchRecord[start.toString()] = true;
        costRecord[start.toString()] = 0;

        while(searchQueue.length){
            let current = searchQueue.get();
            if(current.getNode().toString() == end.toString()){
                break;
            }
            let neighbors = this.getNeighbors(current.node);
            for(let node of neighbors){
                let newCost = costRecord[current.node.toString()] + node.cost;
                if(costRecord[node.toString()] === undefined){ // || newCost < costRecord[node.toString()]
                    searchRecord[node.toString()] = current.getNode();
                    costRecord[node.toString()] = newCost;
                    searchQueue.put(node, newCost);
                    visitHistory.push(new PriorityNode(node, 0));
                }
            }
        }

        return {
            path: this._genPath(end, searchRecord),
            visitHistory: visitHistory,
            searchRecord: searchRecord
        }
    }
}

class BestFirstSearch extends SearchBase{
    constructor(rawData: Array<Array<number>>){
        super(rawData);
    }

    searchPath(start: Node, end: Node){
        let searchQueue: PriorityQueue = new PriorityQueue();
        let searchRecord = {};
        let costRecord = {};
        let visitHistory: Array<PriorityNode> = [];
        searchQueue.put(start, this.heuristics(start, end));
        searchRecord[start.toString()] = true;
        while(searchQueue.length){
            let current = searchQueue.get();
            if(current.getNode().toString() == end.toString()){
                break;
            }
            let neighbors = this.getNeighbors(current.node);
            for(let node of neighbors){
                if(!searchRecord[node.toString()]){
                    searchRecord[node.toString()] = current.getNode();
                    searchQueue.put(node, this.heuristics(node, end));
                    visitHistory.push(new PriorityNode(node, 0));
                }
            }
        }
        return {
            path: this._genPath(end, searchRecord),
            visitHistory: visitHistory,
            searchRecord: searchRecord
        }
    }
}

class AStarSearch extends SearchBase{
    constructor(rawData: Array<Array<number>>){
        super(rawData);
    }

    searchPath(start: Node, end: Node){
        let searchQueue: PriorityQueue = new PriorityQueue();
        let searchRecord = {};
        let costRecord = {};
        let visitHistory: Array<PriorityNode> = [];

        searchRecord[start.toString()] = true;
        costRecord[start.toString()] = 0;
        searchQueue.put(start, this.heuristics(start, end) + costRecord[start.toString()]);
        while(searchQueue.length){
            let current = searchQueue.get();
            if(current.getNode().toString() == end.toString()){
                break;
            }
            let neighbors = this.getNeighbors(current.getNode());
            for(let node of neighbors){
                let newCost = node.cost + costRecord[current.getNode().toString()];
                if(costRecord[node.toString()] === undefined){ // || newCost < costRecord[node.toString()]
                    costRecord[node.toString()] = newCost;
                    searchRecord[node.toString()] = current.getNode();
                    searchQueue.put(node, newCost + this.heuristics(node, end));
                    visitHistory.push(new PriorityNode(node, 0));
                }
            }
        }
        
        return {
            path: this._genPath(end, searchRecord),
            visitHistory: visitHistory,
            searchRecord: searchRecord
        }
    }
}

export {BreadthFirstSearch, DijkstraSearch, BestFirstSearch, AStarSearch, Node, PriorityNode}