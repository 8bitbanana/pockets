// @ts-nocheck

import { Component } from 'preact';
import { DragDropContext, Draggable, Droppable, DropResult, DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

class DraggableItem {
    id: string;
    content: string;

    constructor(id: string, content: string) {
        this.id = id;
        this.content = content;
    }
}

type DraggableExampleState = {
    items: DraggableItem[]
}

export default class DraggableExample extends Component<{}, DraggableExampleState> {

    constructor() {
        super();

        this.state = {
            items: []
        };

        for (let i=0; i < 10; i++)
        {
            this.state.items.push(new DraggableItem(
                `draggable${i}`, `Item ${i}`
            ));
        }
    }

    onDragEnd(result: DropResult) {
        // const { source, destination } = result;
        // if (!destination)
        // {
        //     return;
        // }

        // if (source.droppableId === destination.droppableId) {

        // }
    }

    public render() {

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(pDrop: DroppableProvided, sDrop: DroppableStateSnapshot) => (
                        <div ref={pDrop.innerRef} {...pDrop.droppableProps}>
                            {this.state.items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(pDrag: DraggableProvided, sDrag: DraggableStateSnapshot) => (
                                        <div>
                                            <div ref={pDrag.innerRef} {...pDrag.draggableProps} {...pDrag.dragHandleProps}>
                                                {item.content}
                                            </div>
                                        </div>
                                        
                                    )}
                                </Draggable>
                            ))}
                            {pDrop.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            );
        
    }
}