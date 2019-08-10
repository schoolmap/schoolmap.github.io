//import PinchZoom from "./node_modules/pinch-zoom-js/src/pinch-zoom.js"//"./node_modules/pinch-zoom-js/dist/pinch-zoom.min.js";
//const nameable : HTMLTemplateElement = <HTMLTemplateElement> document.getElementById("nameable");
const directions = document.getElementById("directions");
function nameElement(element) {
    let name = element.dataset["name"];
    if (name) {
        element.insertAdjacentText("afterbegin", element.id); //element.dataset["name"]);
    }
}
function positionElement(element, x, y, width, height) {
    element.style.position = "absolute";
    element.style.left = x.toString() + "px";
    element.style.top = y.toString() + "px";
    element.style.width = width.toString() + "px";
    element.style.height = height.toString() + "px";
}
function dataPositionElement(element) {
    positionElement(element, element.dataset["x"], element.dataset["y"], element.dataset["width"], element.dataset["height"]);
}
class MapRoom extends HTMLElement {
    constructor() {
        super();
        nameElement(this);
        this.style.outline = `${MapRoom.LINE_THICKNESS} ${MapRoom.LINE_COLOR} solid`;
        this.style.backgroundColor = MapRoom.COLOR;
        dataPositionElement(this);
        //const shadowRoot = this.attachShadow({mode: 'open'});
        //shadowRoot.appendChild(document.createElement("slot"));
    }
}
MapRoom.LINE_THICKNESS = "1px";
MapRoom.LINE_COLOR = "#000000";
MapRoom.COLOR = "#ffeed9";
customElements.define("map-room", MapRoom);
class MapDoor extends HTMLElement {
    constructor() {
        super();
        nameElement(this);
        this.style.position = "absolute";
        this.style.borderBottom = `${MapRoom.LINE_THICKNESS} ${MapRoom.COLOR} solid`;
        this.style.borderRight = `${MapRoom.LINE_THICKNESS} ${MapRoom.COLOR} solid`;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        const span = document.createElement("span");
        span.style.position = "absolute";
        span.style.left = "0";
        switch (this.dataset["position"]) {
            case "top":
                this.style.width = MapDoor.SIZE; //this.shadowRoot.host.clientWidth+"px";
                this.style.height = "0";
                this.style.left = (this.parentElement.clientWidth / 2) + "px";
                this.style.top = "0";
                this.style.top = `-${MapRoom.LINE_THICKNESS}`;
                span.style.width = MapDoor.SIZE;
                span.style.height = "0";
                span.style.transform = `rotate(${MapDoor.ANGLE})`;
                span.style.transformOrigin = "right bottom";
                span.style.borderBottom = `${MapRoom.LINE_THICKNESS} ${MapRoom.LINE_COLOR} solid`;
                span.style.borderRight = `${MapRoom.LINE_THICKNESS} ${MapRoom.LINE_COLOR} solid`;
                break;
            case "bottom":
                this.style.width = MapDoor.SIZE;
                this.style.height = "0";
                this.style.left = (this.parentElement.clientWidth / 2) + "px";
                this.style.top = this.parentElement.clientHeight + "px";
                span.style.width = MapDoor.SIZE;
                span.style.height = "0";
                span.style.transform = `rotate(${MapDoor.ANGLE})`;
                span.style.transformOrigin = "left top";
                span.style.borderTop = `${MapRoom.LINE_THICKNESS} ${MapRoom.LINE_COLOR} solid`;
                span.style.borderRight = `${MapRoom.LINE_THICKNESS} ${MapRoom.LINE_COLOR} solid`;
                break;
            case "left":
                this.style.width = "0";
                this.style.height = MapDoor.SIZE;
                this.style.left = "0";
                this.style.top = (this.parentElement.clientHeight / 2) + "px";
                this.style.left = `-${MapRoom.LINE_THICKNESS}`;
                span.style.width = "0";
                span.style.height = MapDoor.SIZE;
                span.style.transform = `rotate(${MapDoor.ANGLE})`;
                span.style.transformOrigin = "right top";
                span.style.borderBottom = `${MapRoom.LINE_THICKNESS} ${MapRoom.LINE_COLOR} solid`;
                span.style.borderRight = `${MapRoom.LINE_THICKNESS} ${MapRoom.LINE_COLOR} solid`;
                break;
            case "right":
                this.style.width = "0";
                this.style.height = MapDoor.SIZE;
                this.style.left = this.parentElement.clientWidth + "px";
                this.style.top = (this.parentElement.clientHeight / 2) + "px";
                span.style.width = "0";
                span.style.height = MapDoor.SIZE;
                span.style.transform = `rotate(${MapDoor.ANGLE})`;
                span.style.transformOrigin = "left bottom";
                span.style.borderBottom = `${MapRoom.LINE_THICKNESS} ${MapRoom.LINE_COLOR} solid`;
                span.style.borderRight = `${MapRoom.LINE_THICKNESS} ${MapRoom.LINE_COLOR} solid`;
                break;
        }
        span.classList.add("door-swing");
        shadowRoot.appendChild(span);
    }
}
MapDoor.SIZE = "10px";
MapDoor.ANGLE = "30deg";
customElements.define("map-door", MapDoor);
class MapStreet extends HTMLElement {
    constructor() {
        super();
        nameElement(this);
        dataPositionElement(this);
        this.style.backgroundColor = MapStreet.COLOR;
        if (this.dataset["vertical"]) {
            this.style.writingMode = "vertical-rl";
        }
    }
}
MapStreet.COLOR = "#d9d9ff";
customElements.define("map-street", MapStreet);
class DirectionLine extends HTMLElement {
    constructor(x1, y1, x2, y2) {
        super();
        const deltaX = x2 - x1, deltaY = y2 - y1, angle = Math.atan2(deltaY, deltaX), length = Math.hypot(x2 - x1, y2 - y1), halfThickness = (DirectionLine.THICKNESS / 2);
        positionElement(this, x1, y1 - halfThickness, length, DirectionLine.THICKNESS);
        //this.style.outline = `${DirectionLine.THICKNESS} ${DirectionLine.COLOR} solid`;
        this.style.backgroundColor = DirectionLine.COLOR;
        this.style.borderLeft = `${DirectionLine.COLOR} ${halfThickness}px solid`;
        this.style.borderRight = `${DirectionLine.COLOR} ${halfThickness}px solid`;
        this.style.borderRadius = halfThickness + "px";
        this.style.transform = `rotate(${angle}rad)`;
        this.style.transformOrigin = `${halfThickness}px ${halfThickness}px`;
    }
}
DirectionLine.COLOR = "#2c992c";
DirectionLine.THICKNESS = 6;
customElements.define("direction-line", DirectionLine);
const map = document.getElementById("map"), mapContainer = document.getElementById("map-container");
{
    let oldX = 0, oldY = 0;
    //mapContainer.addEventListener("pointerdown", down);
    function down(e) {
        e.preventDefault();
        console.log("down");
        oldX = e.clientX;
        oldY = e.clientY;
        mapContainer.addEventListener("pointerup", stop);
        mapContainer.addEventListener("pointercancel", stop);
        //mapContainer.addEventListener("pointerout", stop);
        mapContainer.addEventListener("pointerleave", stop);
        mapContainer.addEventListener("pointermove", move);
    }
    function move(e) {
        e.preventDefault();
        console.log("move");
        map.style.top = (map.offsetTop - (oldY - e.clientY)) + "px";
        map.style.left = (map.offsetLeft - (oldX - e.clientX)) + "px";
        oldX = e.clientX;
        oldY = e.clientY;
    }
    function stop() {
        console.log("stop");
        mapContainer.removeEventListener("pointerup", stop);
        mapContainer.removeEventListener("pointercancel", stop);
        //mapContainer.removeEventListener("pointerout", stop);
        mapContainer.removeEventListener("pointerleave", stop);
        mapContainer.removeEventListener("pointermove", move);
    }
}
{
    let evCache = [];
    let prevDiff = -1;
    function pointerdown_handler(ev) {
        evCache.push(ev);
    }
    function pointermove_handler(ev) {
        for (let i = 0; i < evCache.length; i++) {
            if (ev.pointerId == evCache[i].pointerId) {
                evCache[i] = ev;
                break;
            }
        }
        if (evCache.length == 2) {
            let curDiff = Math.hypot(evCache[0].clientX - evCache[1].clientX, evCache[0].clientY - evCache[1].clientY);
            if (prevDiff > 0) {
                deltaScale((curDiff - prevDiff) / 1000);
                if (curDiff > prevDiff) {
                    // The distance between the two pointers has increased
                    //console.log("in", Math.hypot(evCache[0].clientX - evCache[1].clientX, evCache[0].clientY - evCache[1].clientY))
                }
                if (curDiff < prevDiff) {
                    // The distance between the two pointers has decreased
                    //console.log("out", Math.hypot(evCache[0].clientX - evCache[1].clientX, evCache[0].clientY - evCache[1].clientY))
                }
            }
            prevDiff = curDiff;
        }
    }
    function pointerup_handler(ev) {
        remove_event(ev);
        if (evCache.length < 2) {
            prevDiff = -1;
        }
    }
    function remove_event(ev) {
        for (let i = 0; i < evCache.length; i++) {
            if (evCache[i].pointerId == ev.pointerId) {
                evCache.splice(i, 1);
                break;
            }
        }
    }
    //mapContainer.addEventListener("pointerdown", pointerdown_handler);//onpointerdown = pointerdown_handler;
    //mapContainer.addEventListener("pointermove", pointermove_handler);
    //mapContainer.addEventListener("pointerup", pointerup_handler);
    //mapContainer.addEventListener("pointercancel", pointerup_handler);
    //mapContainer.addEventListener("pointerout", pointerup_handler);
    //mapContainer.addEventListener("pointerleave", pointerup_handler);
}
let scale = 1;
function getScale() {
    return scale;
}
function setScale(newScale) {
    scale = newScale;
    map.style.transform = `scale(${newScale})`;
}
function deltaScale(newDeltaScale) {
    setScale(scale + newDeltaScale);
}
function scrollZoom(e) {
    deltaScale(e["wheelDelta"] / 1000);
}
//document.addEventListener("wheel", scrollZoom);
//setScale(1);
function drawDirections(route) {
    while (directions.firstElementChild) {
        directions.removeChild(directions.firstElementChild);
    }
    let firstCoordinates = getGlobalCoordinates(route[0]), secondCoordinates;
    for (let i = 1; i < route.length; i++) {
        secondCoordinates = getGlobalCoordinates(route[i]);
        directions.appendChild(new DirectionLine(firstCoordinates.x, firstCoordinates.y, secondCoordinates.x, secondCoordinates.y));
        firstCoordinates = secondCoordinates;
    }
}
class DefaultMap {
    constructor(defaultValue = undefined) {
        this.defaultValue = defaultValue;
        this.map = {};
        this.indices = [];
    }
    set(element, value) {
        const index = this.indices.indexOf(element);
        if (index >= 0) {
            this.map[index] = value;
        }
        else {
            this.indices.push(element);
            this.map[this.indices.length - 1] = value;
        }
    }
    get(element) {
        const index = this.indices.indexOf(element);
        if (index >= 0) {
            return this.map[index];
        }
        else {
            this.indices.push(element);
            this.map[this.indices.length - 1] = this.defaultValue;
            return this.defaultValue;
        }
    }
    contains(element) {
        return this.indices.indexOf(element) >= 0;
    }
}
function reconstruct_path(cameFrom, current) {
    let total_path = [current];
    while (cameFrom.contains(current)) {
        current = cameFrom.get(current);
        total_path.unshift(current);
    }
    return total_path;
}
// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
function A_Star(start, goal) {
    let closedSet = [];
    console.log("closedSet", closedSet);
    // The set of discovered nodes that need to be (re-)expanded.
    // Initially, only the start node is known.
    let openSet = [start];
    console.log("openSet", openSet);
    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start to n currently known.
    let cameFrom = new DefaultMap();
    console.log("cameFrom", cameFrom);
    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    let gScore = new DefaultMap(Infinity);
    console.log("gScore", gScore);
    gScore.set(start, 0);
    // For node n, fScore[n] := gScore[n] + h(n).
    let fScore = new DefaultMap(Infinity);
    console.log("fScore", fScore);
    fScore.set(start, getDistance(start, goal));
    while (openSet.length > 0) { //for (let i = 0; i < 2; i++) {
        let lowestFScore = fScore.get(openSet[0]);
        let current = openSet[0];
        for (let node of openSet) {
            let score = fScore.get(node);
            if (score <= lowestFScore) {
                current = node;
                lowestFScore = score;
            }
        }
        console.log(current, openSet, closedSet, cameFrom);
        if (current === goal) {
            return reconstruct_path(cameFrom, current);
        }
        openSet.splice(openSet.indexOf(current), 1);
        closedSet.push(current);
        for (let neighbor of getAllConnectedNodes(current)) {
            if (closedSet.indexOf(neighbor) >= 0) {
                continue;
            }
            // d(current,neighbor) is the weight of the edge from current to neighbor
            // tentative_gScore is the distance from start to the neighbor through current
            let tentative_gScore = gScore.get(current) + getDistance(current, neighbor);
            console.log("tentative", tentative_gScore, current, neighbor);
            if (openSet.indexOf(neighbor) < 0) {
                openSet.push(neighbor);
            } /*else*/
            if (tentative_gScore < gScore.get(neighbor)) {
                console.log("got here");
                // This path to neighbor is better than any previous one. Record it!
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentative_gScore);
                fScore.set(neighbor, tentative_gScore + getDistance(neighbor, goal));
            }
        }
        console.log("one last", openSet);
    }
    // Open set is empty but goal was never reached
    throw new Error("how did we get here? " + start + goal);
}
function pushSelector(selector, array, target = document) {
    let results = target.querySelectorAll(selector);
    for (let i = 0; i < results.length; i++) {
        array.push(results.item(i));
    }
}
function getAllConnectedNodes(element) {
    let nodes = [];
    switch (element.tagName.toLowerCase()) {
        case "map-room":
            pushSelector("map-door", nodes, element);
            pushSelector(`map-door[data-destination=${element.id}]`, nodes);
            break;
        case "map-door":
            let destination = element.dataset["destination"];
            switch (document.getElementById(destination).tagName.toLowerCase()) {
                case "map-room":
                    pushSelector(`#${destination}`, nodes);
                    break;
                case "map-street":
                    pushSelector(`map-door[data-destination=${destination}]`, nodes);
                    pushSelector(`map-intersection[data-other-street=${destination}]`, nodes);
                    pushSelector(`#${destination} > map-intersection`, nodes);
                    break;
            }
            nodes.push(element.parentElement);
            break;
        case "map-intersection":
            pushSelector(`map-door[data-destination=${element.parentElement.id}]`, nodes);
            pushSelector(`map-door[data-destination=${element.dataset["otherStreet"]}]`, nodes);
            pushSelector(`map-intersection[data-other-street=${element.dataset["otherStreet"]}]`, nodes);
            pushSelector("map-intersection", nodes, element.parentElement);
            break;
    }
    let index = nodes.indexOf(element);
    if (index >= 0) {
        nodes.splice(index, 1);
    }
    return nodes;
}
function getGlobalCoordinates(element) {
    switch (element.tagName.toLowerCase()) {
        case "map-room":
            return new Point(element.offsetLeft + (element.offsetWidth / 2), element.offsetTop + (element.offsetHeight / 2));
        case "map-door":
            return new Point(element.offsetLeft + element.parentElement.offsetLeft, element.offsetTop + element.parentElement.offsetTop);
        case "map-intersection":
            if (element.parentElement.dataset["vertical"]) {
                return new Point(element.parentElement.offsetLeft, document.getElementById(element.dataset["otherStreet"]).offsetTop);
            }
            else {
                return new Point(document.getElementById(element.dataset["otherStreet"]).offsetLeft, element.parentElement.offsetTop);
            }
    }
}
function getDistance(firstElement, secondElement) {
    const firstCoordinates = getGlobalCoordinates(firstElement), secondCoordinates = getGlobalCoordinates(secondElement);
    return Math.hypot((firstCoordinates.x - secondCoordinates.x), (firstCoordinates.y - secondCoordinates.y));
}
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
const searchForm = document.querySelector("#search > form"), searchInput = searchForm.querySelector("input[name=search]");
function search(e) {
    e.preventDefault();
    const data = CSS.escape(searchInput.value);
    console.log(map.querySelectorAll(`map-room[data-name=${data}], map-room[data-tag=${data}]`), [...map.querySelectorAll("map-room")].filter((element) => (element.dataset["teacher"] && (element.dataset["teacher"].indexOf(data) >= 0 || element.dataset["teacher"].split(".")[1].indexOf(data) >= 0))));
}
searchForm.addEventListener("submit", search);
//# sourceMappingURL=main.js.map