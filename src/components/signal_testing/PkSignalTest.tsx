import { Button } from "@mui/joy";
import { Signal, signal } from "@preact/signals";
import { DeepSignal, deepSignal } from "deepsignal";
import { Component, Fragment, createContext } from "preact";
import { useContext } from "preact/hooks";

let NumberSignalInner = 0;
const NumberSignal = signal(NumberSignalInner);

let ObjectSignalInner = {inner: 0};
const ObjectSignal = signal(ObjectSignalInner);

const MapSignal = signal(new Map<string,string>);

type ObjectDeepSignalInner = {
    num: number, array: string[], map: Map<string, string>, map_sentinel: boolean
}

const ObjectDeepSignal: DeepSignal<ObjectDeepSignalInner> = deepSignal({
    num: 0, array: ["start "], map: new Map<string, string>(), map_sentinel: false
});

let SignalContext = createContext({} as DeepSignal<ObjectDeepSignalInner>);

class PkNumberSignalListener extends Component {
    render() {

        const obj = useContext(SignalContext);

        console.log("Number updating");

        return <p>Number: {obj.num}</p>;
    }
}

class PkArraySignalListener extends Component {
    render () {

        console.log("Array updating");

        const obj = useContext(SignalContext);

        let ArrayStr = "";
        for (const entry of obj.array) {
            ArrayStr += entry;
        }

        return <p>Array: {ArrayStr}</p>;
    }
}

type PkArrayMapListenerProps = {
    map: Map<string, string>,
    sentinel: Signal<boolean>
}

class PkArrayMapListener extends Component<PkArrayMapListenerProps> {
    render() {
        console.log("Map updating");

        const a = this.props.sentinel.value;

        return <p>Map: {this.props.map.size}</p>;
    }
}

export default class PkSignalTest extends Component {
    render() {

        console.log("Root render");

        return <SignalContext.Provider value={ObjectDeepSignal}>
            <SignalContext.Consumer>
                {obj => {
                    return <Fragment>
                    <PkNumberSignalListener />
                    <Button onClick={() => {
                        obj.num++;
                    }}>Number Add</Button>
                    <PkArraySignalListener />
                    <Button onClick={() => {
                        obj.array.push("hi! ");
                    }}>Array Add</Button>
                    <PkArrayMapListener map={obj.map} sentinel={obj.$map_sentinel!} />
                    <Button onClick={() => {
                        obj.map.set("test" + Math.random(), "test");
                        obj.map_sentinel = !obj.map_sentinel;
                    }}>Map Add</Button>
                    </Fragment>
                }}
            </SignalContext.Consumer>
        </SignalContext.Provider>
    }
}