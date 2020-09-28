import React, {Component} from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import './Column.css';
import Card from '../Card/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function Container(props) {
    const { innerRef, ...rest } = props;

    return <div className="container" ref={innerRef} {...rest}>{props.children}</div>
}

function Title(props) {
    const { children, ...rest } = props;

    return <span className="column-title" {...rest}>{children}</span>
}

function Header(props) {
    return <div className="column-header">{props.children}</div>
}

function Icon(props) {
    return <span className="add-icon"><FontAwesomeIcon icon={faPlus} /></span>
}

function CardListWrapper(props) {
    const { innerRef, children, isDraggingOver, ...rest } = props;

    return <div className="card-list" ref={innerRef} {...rest}>{children}</div>
}

class CardList extends Component {
    // shouldComponentUpdate(nextProps) {
    //     if (nextProps.tasks === this.props.tasks){
    //         return false;
    //     }
    // }

    render() {
        return this.props.tasks.map((task, index) => 
            <Card key={task.id} task={task} index={index} openCardDialog={this.props.openCardDialog}/>
        );
    }

}


export default class Column extends Component {
    render() {
        return (
            <Draggable draggableId={this.props.column.id} index={this.props.index}>
                {provided => (
                    <Container
                        {...provided.draggableProps}
                        innerRef={provided.innerRef}>
                        
                        <Header>
                            <Title {...provided.dragHandleProps}>
                                {this.props.column.title}
                            </Title>
                            <Icon />
                        </Header>

                        <Droppable droppableId={this.props.column.id} type="task">
                            {(provided, snapshot) => (
                                <CardListWrapper
                                    {...provided.droppableProps}
                                    isDraggingOver={snapshot.isDraggingOver}
                                    innerRef={provided.innerRef}>
                                        
                                    <CardList tasks={this.props.tasks} openCardDialog={this.props.openCardDialog}/>
                                    {provided.placeholder}
                                </CardListWrapper>
                            )}
                        </Droppable>
                    </Container>
                )}

            </Draggable>
        )
    }
}



export class ColumnWrapper extends Component {
    // shouldComponentUpdate(nextProps){
    //     //TODO: only update when items are updated

    //     return true;
    // }

    render() {
        const { column, taskMap, index, openCardDialog } = this.props;
        const tasks = column.taskIds.map(taskId => taskMap[taskId]);
        return <Column key={column.id} column={column} tasks={tasks} index={index} openCardDialog={openCardDialog}/>;
    }

}


