import React, {Component} from 'react';
import './KanbanBoard.css';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import "@reach/dialog/styles.css";
import { ColumnWrapper } from '../Column/Column';
import CardDialog from '../CardDialog/CardDialog';
import { tasks, groupings } from '../../data';

// Dialog Library Documentation
// https://reach.tech/dialog/#dialog-ondismiss

class KanbanBoard extends Component {

    state = {
        tasks: {},
        groupings: null,
        // currentGrouping: this.props.currentGrouping,

        currentDialog: null,
        cardDialogTask: null,
        cardDialogStatusId: null,
        cardDialogStatusOptions: null,
        cardDialogBucketId: null,
        cardDialogBucketOptions: null,

        proposedChanges: null,
    };

    componentDidMount() {
        this.renderMyData();
    }

    /**
     * Fetches all the data needed to build the Kanban Board.
     * Fetches all: 
     *      1. Tasks
     *      2. Groupings
     */
    renderMyData() {
        this.setState({
            tasks: tasks,
            groupings: groupings,
        })

        
    }

    onDragEnd = results => {
        const { destination, source, draggableId, type } = results;

        const grouping = this.state.groupings[this.props.currentGrouping];
        const columns = grouping["columns"];
        const columnOrder = grouping["columnOrder"];

        // Dropped outside droppable area
        if (!destination) {
            return;
        }

        // Dropped exactly where it was before
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Column was dragged to new position
        if (type === 'column'){
            const newColumnOrder = Array.from(columnOrder);
            newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, draggableId);

            const newGrouping = {
                ...grouping,
                columnOrder: newColumnOrder,
            }

            this.setState({
                groupings: {
                    ...this.state.groupings,
                    [grouping.id]: newGrouping
                }
            });
            return;
        }
        
        const start = columns[source.droppableId]
        const finish = columns[destination.droppableId]

        // If moving within the same column
        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            };
            
            this.setState({
                groupings: {
                    ...this.state.groupings,
                    [grouping.id]: {
                        ...grouping,
                        columns: {
                            ...columns,
                            [start.id]: newColumn,
                        }
                    }
                }
            });
            return;
        }

        // Moving card from one column to another
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStartColumn = {
            ...start,
            taskIds: startTaskIds,
        }

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinishColumn = {
            ...finish,
            taskIds: finishTaskIds,
        };

        this.setState({
            groupings: {
                ...this.state.groupings,
                [grouping.id]: {
                    ...grouping,
                    columns: {
                        ...columns,
                        [start.id]: newStartColumn, 
                        [finish.id]: newFinishColumn,
                    }
                }
            }
        });
    }

    /**
     * Opens the Card Dialog and assigns the passed in task as the task to display 
     * in the Card Dialog.
     * 
     * @param {string} taskId 
     * @param {string} colId 
     */
    openCardDialog = (taskId, colId) => {
        const columns = this.state.groupings[this.props.currentGrouping]["columns"]
        this.setState({ 
            currentDialog: "EDIT_TASK",
            cardDialogTask: this.state.tasks[taskId],
            cardDialogStatusId: colId,
            cardDialogStatusOptions: Object.entries(columns).map(([id, col]) => 
                ({ id: id, name: col.title})
            ),
        })
    }


    /**
     * Does a comparison between the state of the task object in the card dialog before opening
     * and after closing. If a change has been made, propagate that change to the API via the 
     * editTask or editAndMoveTask functions (depending on whether the change also results in a column
     * switch).
     * 
     * The changes object will have key-values for properties that were available for change in the 
     * Card Dialog representing the values when the Card Dialog was closed.
     * 
     * @param {obj} changes 
     */
    closeCardDialog = (changes) => {
        const task = this.state.cardDialogTask;
        const statusId = this.state.cardDialogStatusId;

        // Update task in DB if task was changed
        const descriptionChanged = changes.description !== task.description;
        const dueDateChanged = (changes.dueDate ? changes.dueDate.getTime() : null) !== (task.dueDate ? task.dueDate.getTime() : null)
        const statusChanged = changes.statusId !== statusId;
        if (descriptionChanged || dueDateChanged || statusChanged) {
            const newTask = {
                ...task,
                description: changes.description,
                dueDate: changes.dueDate,
            }

            // Update status columns if the card has changed status
            if (statusChanged) {
                const grouping = this.state.groupings[this.props.currentGrouping];
                const statusColumns = this.state.groupings[this.props.currentGrouping].columns;

                // Update taskIds order for previous status column
                const prevColumnTaskIds = Array.from(statusColumns[statusId].taskIds);
                prevColumnTaskIds.splice(prevColumnTaskIds.indexOf(task.id), 1);
                const previousStatusColumn = {
                    ...statusColumns[statusId],
                    taskIds: prevColumnTaskIds,
                }

                // Update taskIds order for next status column
                const nextColumnTaskIds = Array.from(statusColumns[changes.statusId].taskIds);
                nextColumnTaskIds.push(task.id);
                const nextStatusColumn = {
                    ...statusColumns[changes.statusId],
                    taskIds: nextColumnTaskIds,
                }

                this.setState({
                    // Hide card dialog
                    currentDialog: null,
                    cardDialogTask: null,
                    proposedChanges: null,
                    // Update task with changes                
                    tasks: {
                        ...this.state.tasks,
                        [newTask.id]: newTask,
                    },
                    // Update columns
                    groupings: {
                        ...this.state.groupings,
                        [grouping.id]: {
                            ...grouping,
                            columns: {
                                ...grouping.columns,
                                [previousStatusColumn.id]: previousStatusColumn,
                                [nextStatusColumn.id]: nextStatusColumn,
                            }
                        }

                    }
                });

            } else {
                this.setState({
                    // Hide card dialog
                    currentDialog: null,
                    cardDialogTask: null,
                    proposedChanges: null,
                    // Update task with changes                
                    tasks: {
                        ...this.state.tasks,
                        [newTask.id]: newTask,
                    }
                });
            }           
        } else {
            this.setState({
                currentDialog: null,
                cardDialogTask: null,
                proposedChanges: null,
            });
        }
    }

    /**
     * Updates the state to reflect the newly added task then calls the 
     * addTask function to propagate change to API.
     * 
     * @param {Task obj} task 
     * @param {string} columnId 
     */
    addNewTask = (task, columnId) => {
        // Add attributes that would typically be added by the backend
        task.id = "task-" + Object.keys(this.state.tasks).length + 1;
        task.createdDate = new Date();
        
        const grouping = this.state.groupings[this.props.currentGrouping];
        this.setState({
            tasks: {
                ...this.state.tasks,
                [task.id]: task,
            },
            groupings: {
                ...this.state.groupings,
                [grouping.id]: {
                    ...grouping,
                    columns: {
                        ...grouping.columns,
                        [columnId]: {
                            ...grouping.columns[columnId],
                            taskIds: [task.id].concat(grouping.columns[columnId].taskIds),
                        }
                    }
                }
            }
        })
    }

    render() {
        // Generate all the column elements relevant for the current grouping
        let columnsList;
        if (this.state.groupings) {
            const currentGroup = this.state.groupings[this.props.currentGrouping];
            columnsList = currentGroup.columnOrder.map((columnId, index) => {
                const column = currentGroup.columns[columnId];
                return (
                    <ColumnWrapper
                        key={column.id}
                        column={column}
                        taskMap={this.state.tasks}
                        index={index}
                        openCardDialog={this.openCardDialog}
                        addTask={this.addNewTask}/>
                )
            });
        } else {
            columnsList = null
        }

        // Function to display the dialog to be open as indicated by the state.
        // Default is no dialog.
        const dialog = () => {
            switch(this.state.currentDialog){
                case "EDIT_TASK":
                    return (
                        <CardDialog
                            closeCardDialog={this.closeCardDialog}
                            task={this.state.cardDialogTask}
                            statusId={this.state.cardDialogStatusId}
                            statusOptions={this.state.cardDialogStatusOptions}
                            bucketId={this.state.cardDialogBucketId}
                            bucketOptions={this.state.cardDialogBucketOptions} />
                    )
                default:
                    return null
            }
        }

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="all-columns" direction="horizontal" type="column">
                    {provided => (
                        <KanbanBoardContainer
                            {...provided.droppableProps}
                            innerRef={provided.innerRef}>
                            
                            {columnsList}
                            {provided.placeholder}
                        </KanbanBoardContainer>
                    )}
                </Droppable>
                {dialog()}
            </DragDropContext>

        );
    }
}

function KanbanBoardContainer(props) {
    const { innerRef, children, ...rest } = props;

    return (
        <div className="kanban-style-board" ref={innerRef} {...rest}>
            {children}
        </div>
    );
}

export default KanbanBoard;