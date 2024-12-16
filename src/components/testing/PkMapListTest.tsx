
import { Signal } from "@preact/signals";
import SignalWrapper from "components/utils/SignalWrapper";
import { ContainerBase } from "lib/ContainerBase";
import { Component, createContext } from "preact";
import { useContext } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";

let map_base = new ContainerBase<string, string>();
map_base.set("test1", "hi");
map_base.set("test2", "hii");
map_base.set("test3", "hiii");

type MapSignal = SignalWrapper<ContainerBase<string, string>>;

type ContextType = {data: MapSignal};

let ctx_root = createContext({} as ContextType);

type PkMapListEntryProps = {my_key: string, map: MapSignal};

class PkMapListEntry extends Component<PkMapListEntryProps> {

    componentDidMount(): void {
        console.log(`Entry mount ${this.props.my_key}`);
    }
    componentWillUnmount(): void {
        console.log(`Entry unmount ${this.props.my_key}`);
    }

    render() {

        const expr = this.props.map.get_inner().get(this.props.my_key)!;

        console.log(`Entry render ${this.props.my_key}:${expr}`);

        return <div>
            <input type="text" value={this.props.my_key} onChange={(event)=>{
                this.props.map.mutate((inner) => {
                    inner.rename(this.props.my_key, event.currentTarget.value);
                });

                //this.forceUpdate();
            }}/>
            <input type="text" value={expr} onChange={(event)=>{
                if (event.currentTarget.value !== expr) {

                    this.props.map.mutate((inner) => {
                        inner.modify(this.props.my_key, event.currentTarget.value);
                    }, false);

                    this.forceUpdate();
                }
            }}/>
        </div>
    }
}

type PkMapListRootProps = {map: MapSignal};

class PkMapListRoot extends Component<PkMapListRootProps> {
    render() {

        console.log("Root render");

        const elements: JSXInternal.Element[] = [];
        this.props.map.get_inner().forEachKey((key) => {
            elements.push(
                <PkMapListEntry my_key={key} map={this.props.map} />
            )
        });

        return <div>{elements}</div>;
    }
}

export default class PkMapListTest extends Component {
    render() {

        return <ctx_root.Provider value={{data: new SignalWrapper(map_base)}}>
            <ctx_root.Consumer>{ctx_root => {
                return <PkMapListRoot map={ctx_root.data} />;
    }       }</ctx_root.Consumer>
        </ctx_root.Provider>
    }
}