export const tasks = {
    "task-1": {
        "id": "task-1",
        "description": "Feature: User can switch between different projects/boards.",
        "dueDate": new Date(),
        "createdDate": new Date(),
    },
    "task-2": {
        "id": "task-2",
        "description": "Feature: User can add additional columns.",
        "dueDate": new Date(),
        "createdDate": new Date()
    },
    "task-3": {
        "id": "task-3",
        "description": "Fix: New cards are being added to end of column. They should be added to the beginning.",
        "dueDate": new Date(),
        "createdDate": new Date()
    },
    "task-4": {
        "id": "task-4",
        "description": "Feature: Add 'Start Date' field to tasks.",
        "dueDate": null,
        "createdDate": new Date()
    },
    "task-5": {
        "id": "task-5",
        "description": "Fix: 'Due Date' value of task moved one day back when edit dialog is closed.",
        "dueDate": null,
        "createdDate": new Date()
    }     
}

export const groupings = {
    "status" : {
        "id": "status",
        "columns": {
            "status-1": {
                "id": "status-1",
                "title": "To do",
                "taskIds": ["task-1", "task-2"]
            },
            "status-2": {
                "id": "status-2",
                "title": "In Progress",
                "taskIds": ["task-3", "task-4", "task-5"]
            },
            "status-3": {
                "id": "status-3",
                "title": "Complete",
                "taskIds": []
            }            
        },
        "columnOrder": ["status-1", "status-2", "status-3"]
    },
    "bucket" : {
        "id": "bucket",
        "columns": {
            "bucket-1": {
                "id": "bucket-1",
                "title": "Feature",
                "taskIds": ["task-1", "task-2", "task-4"]
            },
            "bucket-2": {
                "id": "bucket-2",
                "title": "Bug Fix",
                "taskIds": ["task-3", "task-5"]
            },
            "bucket-3": {
                "id": "bucket-3",
                "title": "Unassigned",
                "taskIds": []
            },
        },
        "columnOrder": ["bucket-3", "bucket-1", "bucket-2",]
    }
}