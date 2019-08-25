
console.log = function() {}; // Dirty disable all logging

const directions = document.getElementById("directions");

const elementsToResizeText : Array<HTMLElement> = [];

document.addEventListener("DOMContentLoaded", resizeAllText);

function resizeAllText() {
    for (let element of elementsToResizeText) {
        resizeText(element);
    }
}

function resizeText(element : HTMLElement) {
    let fontSize = parseInt(getComputedStyle(element).fontSize.split("px")[0]);
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
        (<HTMLElement>children[i]).style.display = "none";
    }
    while (fontSize > 1 && ((element.scrollWidth > element.offsetWidth) || (element.scrollHeight > element.offsetHeight))) {
        fontSize--;
        element.style.fontSize = fontSize+"px";
    }
    for (let i = 0; i < children.length; i++) {
        (<HTMLElement>children[i]).style.display = "";
    }
}

function nameElement(element : HTMLElement) {
    let name = element.dataset["name"];
    if (name) {
        element.insertAdjacentText("afterbegin", element.dataset["name"]);//element.dataset["name"]+" ("+element.id+")");//element.id);//
    }
    elementsToResizeText.push(element);
}

function dataPositionElementOffset(element) {
    if (element.dataset["offsetLeft"]) {
        element.style.left = (parseInt(element.style.left.replace("px", "")) + parseInt(element.dataset["offsetLeft"])).toString() + "px";
    }
    if (element.dataset["offsetTop"]) {
    element.style.top = (parseInt(element.style.top.replace("px", "")) + parseInt(element.dataset["offsetTop"])).toString()+"px";
    }
}

function positionElement(element : HTMLElement, x : number, y : number, width : number, height : number) {
    element.style.position = "absolute";
    if (element.tagName.toLowerCase() == "map-room") {
        x -= (MapRoom.LINE_THICKNESS / 2);
        y -= (MapRoom.LINE_THICKNESS / 2);
        width += MapRoom.LINE_THICKNESS;
        height += MapRoom.LINE_THICKNESS;
    }
    element.style.left = x.toString() + "px";
    element.style.top = y.toString() + "px";
    element.style.width = width.toString() + "px";
    element.style.height = height.toString() + "px";
}

function dataPositionElement(element : HTMLElement) {
    positionElement(element, parseInt(element.dataset["x"]), parseInt(element.dataset["y"]), parseInt(element.dataset["width"]), parseInt(element.dataset["height"]));
    dataPositionElementOffset(element);
}

class MapRoom extends HTMLElement {
    static readonly LINE_THICKNESS = 1;
    static readonly LINE_COLOR = "#000000";
    static readonly COLOR = "#ffeed9";

    constructor() {
        super();
        nameElement(this);
        this.style.outline = `${MapRoom.LINE_THICKNESS}px ${MapRoom.LINE_COLOR} solid`;
        this.style.backgroundColor = MapRoom.COLOR;
        dataPositionElement(this);
        //const shadowRoot = this.attachShadow({mode: 'open'});
        //shadowRoot.appendChild(document.createElement("slot"));
    }

    /*constructor(x : number, y : number, width : number, height : number) {
        super();
        if (typeof x === "undefined") {
            dataPositionElement(this);
        } else {
            positionElement(this, x, y, width, height);
            this.dataset["x"] = x.toString();
            this.dataset["y"] = y.toString();
            this.dataset["width"] = width.toString();
            this.dataset["height"] = height.toString();
        }
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(document.createElement("slot"));
    }*/

}

customElements.define("map-room", MapRoom);

class MapStreet extends HTMLElement {
    static readonly COLOR = "#d9d9ff";

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

customElements.define("map-street", MapStreet);

class MapIntersection extends HTMLElement {

    get clientHeight() {
        return this.parentElement.clientHeight;
    }

    get clientWidth() {
        return this.parentElement.clientWidth;
    }

}

customElements.define("map-intersection", MapIntersection);

class MapDoor extends HTMLElement {
    static readonly SIZE = 10;
    static readonly ANGLE = "30deg";

    constructor() {
        super();
        nameElement(this);
        this.style.position = "absolute";
        switch (this.parentElement.tagName.toLowerCase()) {
            case "map-room":
                this.style.borderBottom = `${MapRoom.LINE_THICKNESS / 2}px ${MapRoom.COLOR} solid`;
                this.style.borderRight = `${MapRoom.LINE_THICKNESS / 2}px ${MapRoom.COLOR} solid`;
                break;
            case "map-street":
                this.style.borderBottom = `${MapRoom.LINE_THICKNESS / 2}px ${MapStreet.COLOR} solid`;
                this.style.borderRight = `${MapRoom.LINE_THICKNESS / 2}px ${MapStreet.COLOR} solid`;
                break;
        }
        const shadowRoot = this.attachShadow({mode: 'open'});
        const span = document.createElement("span");
        span.style.position = "absolute";
        span.style.left = "0";
        switch (this.dataset["position"]) {
            case "top":
                this.style.width = MapDoor.SIZE.toString()+"px";
                this.style.height = "0";
                this.style.left = ((this.parentElement.clientWidth - MapDoor.SIZE) / 2)+"px";
                this.style.top = "0";
                this.style.top = `-${MapRoom.LINE_THICKNESS / 2}px`;

                span.style.width = MapDoor.SIZE.toString()+"px";
                span.style.height = "0";
                span.style.transform = `rotate(${MapDoor.ANGLE})`;
                span.style.transformOrigin = "right bottom";
                span.style.borderBottom = `${MapRoom.LINE_THICKNESS / 2}px ${MapRoom.LINE_COLOR} solid`;
                span.style.borderRight = `${MapRoom.LINE_THICKNESS / 2}px ${MapRoom.LINE_COLOR} solid`;

                break;
            case "bottom":
                this.style.width = MapDoor.SIZE.toString()+"px";
                this.style.height = "0";
                this.style.left = ((this.parentElement.clientWidth - MapDoor.SIZE) / 2)+"px";
                this.style.top = this.parentElement.clientHeight+"px";

                span.style.width = MapDoor.SIZE.toString()+"px";
                span.style.height = "0";
                span.style.transform = `rotate(${MapDoor.ANGLE})`;
                span.style.transformOrigin = "left top";
                span.style.borderTop = `${MapRoom.LINE_THICKNESS / 2}px ${MapRoom.LINE_COLOR} solid`;
                span.style.borderRight = `${MapRoom.LINE_THICKNESS / 2}px ${MapRoom.LINE_COLOR} solid`;

                break;
            case "left":
                this.style.width = "0";
                this.style.height = MapDoor.SIZE.toString()+"px";
                this.style.left = "0";
                this.style.top = ((this.parentElement.clientHeight - MapDoor.SIZE) / 2)+"px";
                this.style.left = `-${MapRoom.LINE_THICKNESS / 2}px`;

                span.style.width = "0";
                span.style.height = MapDoor.SIZE.toString()+"px";
                span.style.transform = `rotate(${MapDoor.ANGLE})`;
                span.style.transformOrigin = "right top";
                span.style.borderBottom = `${MapRoom.LINE_THICKNESS / 2}px ${MapRoom.LINE_COLOR} solid`;
                span.style.borderRight = `${MapRoom.LINE_THICKNESS / 2}px ${MapRoom.LINE_COLOR} solid`;

                break;
            case "right":
                this.style.width = "0";
                this.style.height = MapDoor.SIZE.toString()+"px";
                this.style.left = this.parentElement.clientWidth+"px";
                this.style.top = ((this.parentElement.clientHeight - MapDoor.SIZE) / 2)+"px";

                span.style.width = "0";
                span.style.height = MapDoor.SIZE.toString()+"px";
                span.style.transform = `rotate(${MapDoor.ANGLE})`;
                span.style.transformOrigin = "left bottom";
                span.style.borderBottom = `${MapRoom.LINE_THICKNESS / 2}px ${MapRoom.LINE_COLOR} solid`;
                span.style.borderRight = `${MapRoom.LINE_THICKNESS / 2}px ${MapRoom.LINE_COLOR} solid`;

                break;
        }

        span.classList.add("door-swing");
        shadowRoot.appendChild(span);
        dataPositionElementOffset(this);
    }


}

customElements.define("map-door", MapDoor);

class DirectionLine extends HTMLElement {
    static readonly COLOR = "#2c992c";
    static readonly THICKNESS = 6;

    constructor(x1 : number, y1 : number, x2 : number, y2 : number) {
        super();
        const deltaX = x2 - x1,
            deltaY = y2 - y1,
            angle = Math.atan2(deltaY, deltaX),
            length = Math.hypot(x2 - x1, y2 - y1),
            halfThickness = (DirectionLine.THICKNESS / 2);
        positionElement(this, x1, y1 - halfThickness, length, DirectionLine.THICKNESS);
        //this.style.outline = `${DirectionLine.THICKNESS} ${DirectionLine.COLOR} solid`;
        this.style.backgroundColor = DirectionLine.COLOR;
        this.style.borderLeft = `${DirectionLine.COLOR} ${halfThickness}px solid`;
        this.style.borderRight = `${DirectionLine.COLOR} ${halfThickness}px solid`;
        this.style.borderRadius = halfThickness+"px";
        this.style.transform = `rotate(${angle}rad)`;
        this.style.transformOrigin = `${halfThickness}px ${halfThickness}px`
    }
}

customElements.define("direction-line", DirectionLine)

class SearchResult extends HTMLElement {
    static readonly BACKGROUND_COLOR = getComputedStyle(document.getElementById("search"))["backgroundColor"];

    constructor(readonly element : HTMLElement) {
        super();
        const h4 = document.createElement("h4");
        this.appendChild(h4);
        h4.style.marginBottom = "0";
        h4.appendChild(document.createTextNode(element.dataset["name"]));
        const tag = element.dataset["tag"];
        if (tag) {
            const em = document.createElement("em");
            this.appendChild(em);
            em.appendChild(document.createTextNode(tag));
        }
        const teacher = element.dataset["teacher"];
        if (teacher) {
            this.appendChild(document.createTextNode(teacher));
        }
        const a = document.createElement("span");
        a.classList.add("link");
        a.appendChild(document.createTextNode("Directions"));
        a.addEventListener("click", (e) => {
            try {
                e.preventDefault();
                this.removeChild(a);
                directionLocations.appendChild(this.parentElement);
                directionLocations.style.display = "";
                switch (directionLocations.childElementCount) {
                    case 2 :
                        searchResults.style.display = "none";
                        let directionArray = A_Star(directionLocations.firstElementChild.firstElementChild["element"], this.element);
                        console.log(directionArray);
                        drawDirections(directionArray);
                        break;
                    case 1:
                        toFirstSearch();
                        directions.appendChild(createHighLight(this.element));
                        break;
                    default:
                        while (directionLocations.childElementCount > 1) {
                            directionLocations.removeChild(directionLocations.firstElementChild);
                        }
                        while (directions.firstElementChild) {
                            directions.removeChild(directions.firstElementChild);
                        }
                        toFirstSearch();
                        directions.appendChild(createHighLight(this.element));
                }
            } catch (e) {
                console.error(e);
            }
            return false;
        });
        this.appendChild(a);
    }
}

customElements.define("search-result", SearchResult)

const map = document.getElementById("map"),
    mapContainer = document.getElementById("map-container"),
    ROOM_DOOR_SHORTCUT_AVERSION_WEIGHT = 100; // this

function createHighLight(element : HTMLElement) : HTMLDivElement {
    let div = document.createElement("div");
    div.classList.add("highlight");
    div.style.width = (element.offsetWidth - (MapRoom.LINE_THICKNESS * 2))+"px";
    div.style.height = (element.offsetHeight - (MapRoom.LINE_THICKNESS * 2))+"px";
    div.style.left = element.offsetLeft+"px";
    div.style.top = element.offsetTop+"px";
    return div;
}

function drawDirections(route : Array<HTMLElement>) : void {
    while (directions.firstElementChild) {
        directions.removeChild(directions.firstElementChild);
    }
    let firstCoordinates = getGlobalCoordinates(route[0]), secondCoordinates
    for (let i = 1; i < route.length; i++) {
        secondCoordinates = getGlobalCoordinates(route[i])
        directions.appendChild(new DirectionLine(firstCoordinates.x, firstCoordinates.y, secondCoordinates.x, secondCoordinates.y))
        firstCoordinates = secondCoordinates;
    }

}

class DefaultMap<key, value> {
    private map : {[k : number]: value} = {};
    private indices : Array<key> = [];

    constructor(private defaultValue : value = undefined) {}

    set(element : key, value : value) : void {
        const index = this.indices.indexOf(element);
        if (index >= 0) {
            this.map[index] = value;
        } else {
            this.indices.push(element);
            this.map[this.indices.length - 1] = value;
        }
    }

    get(element : key) : value {
        const index = this.indices.indexOf(element);
        if (index >= 0) {
            return this.map[index];
        } else {
            this.indices.push(element);
            this.map[this.indices.length - 1] = this.defaultValue;
            return this.defaultValue;
        }
    }

    contains(element : key) : boolean {
        return this.indices.indexOf(element) >= 0;
    }

}

function reconstruct_path(cameFrom : DefaultMap<HTMLElement, HTMLElement>, current : HTMLElement) : Array<HTMLElement>{
    let total_path : Array<HTMLElement> = [current];
    while (cameFrom.contains(current)) {
        current = cameFrom.get(current);
        total_path.unshift(current);
    }
    return total_path
}

// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
function A_Star(start : HTMLElement, goal : HTMLElement) : Array<HTMLElement> {

    let closedSet : Array<HTMLElement> = [];
    console.log("closedSet", closedSet);

    // The set of discovered nodes that need to be (re-)expanded.
    // Initially, only the start node is known.
    let openSet : Array<HTMLElement> = [start];
    console.log("openSet", openSet);

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start to n currently known.
    let cameFrom : DefaultMap<HTMLElement, HTMLElement> = new DefaultMap();
    console.log("cameFrom", cameFrom);

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    let gScore : DefaultMap<HTMLElement, number> = new DefaultMap(Infinity);
    console.log("gScore", gScore);
    gScore.set(start, 0);

    // For node n, fScore[n] := gScore[n] + h(n).
    let fScore : DefaultMap<HTMLElement, number> = new DefaultMap(Infinity);
    console.log("fScore", fScore);
    fScore.set(start, getDistance(start, goal));

    while (openSet.length > 0) { //for (let i = 0; i < 2; i++) {
        let lowestFScore : number = fScore.get(openSet[0]);
        let current : HTMLElement = openSet[0];
        for (let node of openSet) {
            let score : number = fScore.get(node);
            if (score <= lowestFScore) {
                current = node;
                lowestFScore = score;
            }
        }
        console.log(current, openSet, closedSet, cameFrom);
        if (current === goal) {
            return reconstruct_path(cameFrom, current)
        }
        openSet.splice(openSet.indexOf(current), 1);
        closedSet.push(current);
        for (let neighbor of getAllConnectedNodes(current)) {
            if (closedSet.indexOf(neighbor) >= 0) {
                continue
            }
            // d(current,neighbor) is the weight of the edge from current to neighbor
            // tentative_gScore is the distance from start to the neighbor through current
            let tentative_gScore : number = gScore.get(current) + getDistance(current, neighbor);
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
    throw new Error("how did we get here? "+start.id+" "+goal);

}

function pushSelector(selector : string, array : Array<Node>, target : HTMLDocument | HTMLElement = document) : void {
    let results : NodeList = target.querySelectorAll(selector);
    for (let i = 0; i < results.length; i++) {
        array.push(results.item(i));
    }
}

function getAllConnectedNodes(element : HTMLElement) : Array<HTMLElement>{
    let nodes : Array<HTMLElement> = [];
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
            pushSelector(`map-intersection[data-other-street=${element.parentElement.id}]`, nodes);
            pushSelector(`#${element.dataset["otherStreet"]} > map-intersection`, nodes);
            pushSelector("map-intersection", nodes, element.parentElement);
            break;
    }
    nodes = nodes.filter((node) => (node && node != element));
    return nodes;
}

function getGlobalCoordinates(element : HTMLElement) : Point {
    switch (element.tagName.toLowerCase()) {
        case "map-room":
            return new Point(element.offsetLeft + (element.offsetWidth / 2), element.offsetTop + (element.offsetHeight / 2));
        case "map-door":
            return new Point(element.offsetLeft + element.parentElement.offsetLeft + (element.offsetWidth / 2), element.offsetTop + element.parentElement.offsetTop + (element.offsetHeight / 2));
        case "map-intersection":
            if (element.parentElement.dataset["vertical"]) {
                return new Point(element.parentElement.offsetLeft + (element.parentElement.offsetWidth / 2), document.getElementById(element.dataset["otherStreet"]).offsetTop + (document.getElementById(element.dataset["otherStreet"]).offsetHeight / 2))
            } else {
                return new Point(document.getElementById(element.dataset["otherStreet"]).offsetLeft + (document.getElementById(element.dataset["otherStreet"]).offsetWidth / 2), element.parentElement.offsetTop + (element.parentElement.offsetHeight / 2))
            }
    }
}

function getDistance(firstElement : HTMLElement, secondElement : HTMLElement) : number {
    const firstCoordinates = getGlobalCoordinates(firstElement),
        secondCoordinates = getGlobalCoordinates(secondElement);
    let distance = Math.hypot((firstCoordinates.x - secondCoordinates.x), (firstCoordinates.y - secondCoordinates.y));
    if ((firstElement.tagName.toLowerCase() == "map-room" && secondElement.tagName.toLowerCase() == "map-door") || (firstElement.tagName.toLowerCase() == "map-door" && secondElement.tagName.toLowerCase() == "map-room")) {
        return distance + ROOM_DOOR_SHORTCUT_AVERSION_WEIGHT;
    } else {
        return distance;
    }
}


class Point {
    constructor(readonly x: number, readonly y: number) {}
}

const searchForm = document.querySelector("#search > form"),
    searchInput : HTMLInputElement = searchForm.querySelector("input[name=search]"),
    searchResults : HTMLOListElement = <HTMLOListElement> document.getElementById("results"),
    oneTimeSearch = document.getElementById("oneTimeSearch"),
    noResults = document.createElement("em"),
    directionLocations = document.getElementById("directionLocations");
noResults.appendChild(document.createTextNode("No results."))
let firstSearch = true;

function onFirstSearch() {
    searchResults.style.display = "";
    oneTimeSearch.style.display = "none";
    firstSearch = false;
}

function toFirstSearch() {
    searchResults.style.display = "none";
    oneTimeSearch.style.display = "";
    firstSearch = true;
    while (searchResults.firstElementChild) {
        searchResults.removeChild(searchResults.firstElementChild);
    }
}

function search(e : Event) {
    e.preventDefault();
    searchResults.style.display = "";
    if (firstSearch) {
        onFirstSearch();
    }
    while (searchResults.firstElementChild) {
        searchResults.removeChild(searchResults.firstElementChild);
    }
    const data = searchInput.value,
        dataEscape = CSS.escape(data),
        dataRegExp = new RegExp(data, "i");
    let results : Array<HTMLElement> = [];
    results.push(...<any>map.querySelectorAll("map-room"));
    results = results.filter((element : HTMLElement)=>(
        (
            element.dataset["name"] &&
                (element.dataset["name"].search(dataRegExp) >= 0)
        ) ||
        (
            element.dataset["teacher"] &&
                (element.dataset["teacher"].search(dataRegExp) >= 0 ||
                 element.dataset["teacher"].split(".")[1].search(dataRegExp) >= 0)
        ) ||
        (
            element.dataset["tag"] &&
            (element.dataset["tag"].search(dataRegExp) >= 0)

        )
    ));
    results.sort((first, second) => {
        const firstString = ((
                second.dataset["name"] &&
                (second.dataset["name"].search(dataRegExp) >= 0)
            ) ? second.dataset["name"] : (
                (
                    second.dataset["teacher"] &&
                    (second.dataset["teacher"].search(dataRegExp) >= 0 ||
                        second.dataset["teacher"].split(".")[1].search(dataRegExp) >= 0)
                ) ? second.dataset["teacher"] : (
                    (
                        second.dataset["tag"] &&
                        (second.dataset["tag"].search(dataRegExp) >= 0)

                    ) ? second.dataset["tag"] : (console.log("Error", second), "")))),
            secondString = ((
                first.dataset["name"] &&
                (first.dataset["name"].search(dataRegExp) >= 0)
            ) ? first.dataset["name"] : (
                (
                    first.dataset["teacher"] &&
                    (first.dataset["teacher"].search(dataRegExp) >= 0 ||
                        first.dataset["teacher"].split(".")[1].search(dataRegExp) >= 0)
                ) ? first.dataset["teacher"] : (
                    (
                        first.dataset["tag"] &&
                        (first.dataset["tag"].search(dataRegExp) >= 0)

                    ) ? first.dataset["tag"] : (console.log("Error", first), "")))),
            difference = secondString.length - firstString.length;
        if (difference === 0) {
            return -firstString.localeCompare(secondString)
        } else {
            return difference
        }
    });
    if (results.length > 0) {
        for (let element of results) {
            const li = document.createElement("li");
            li.append(new SearchResult(element));
            searchResults.appendChild(li);
        }
    } else {
        searchResults.appendChild(noResults);
    }
}

searchForm.addEventListener("submit", search);

const floating = document.getElementById("floating"),
    collapse = document.getElementById("collapse"),
    searchButton : HTMLElement = searchForm.querySelector("button[type=submit]");

function collapseFloating() {
    floating.style.visibility = "hidden";
    searchInput.style.display = "none";
    searchButton.style.display = "none";
    directionLocations.style.display = "none";
    collapse.innerText = "<";
    collapse.addEventListener("click", expandFloating);
    collapse.removeEventListener("click", collapseFloating);
}

function expandFloating() {
    floating.style.visibility = "";
    searchInput.style.display = "";
    searchButton.style.display = "";
    directionLocations.style.display = "";
    collapse.innerText = ">";
    collapse.addEventListener("click", collapseFloating);
    collapse.removeEventListener("click", expandFloating);
}

collapse.addEventListener("click", collapseFloating);
