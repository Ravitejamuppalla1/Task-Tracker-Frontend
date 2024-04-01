import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import { Grid, Card, CardContent, CardHeader, Typography, Modal, Box, Button, Divider } from "@mui/material";
import { asyncCreateTask, asyncDeleteTask, asyncEditTask, asyncGetTasks, asyncSort, asyncSortTask } from "../actions/tasksActions";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import Swal from "sweetalert2";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';


const Home = (props) => {

    const [openmModal, setOpenModal] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [team, setTeam] = useState('')
    const [assignee, setAssignee] = useState('')
    const [priority, setPriority] = useState('0')
    const [status, setStatus] = useState('0')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [startDateValue, setStartDateValue] = useState([null, null])
    const [showFormErrors, setShowFormErrors] = useState(false)
    const [formErrors, setformErrors] = useState({});
    const [taskData, setTaskData] = useState([])
    const [showDropdown, setShowDropdown] = useState(null)
    const [show, setShow] = useState(false)
    const [editTask, setEditTask] = useState(false)
    const [taskId, setTaskId] = useState('')
    const [sortPriority, setSortPriority] = useState('0')
    const [filterPriority, setFilterPriority] = useState('0')
    const [filterAssignee, setFilterAssignee] = useState('')
    const [showLogOut, setShowLogOut] = useState(false)
    const [filter, setFilter] = useState(false)


    const errors = {}
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(asyncGetTasks())
    }, [])


    const tasks = useSelector((state) => state.tasks)

    useEffect(() => {
        setTaskData(tasks)
    }, [tasks])



    const runValidations = () => {
        if (title.length === 0) {
            errors.title = 'Title cannot be blank'
        }
        if (description.length === 0) {
            errors.description = 'Description cannot be blank'
        }
        if (team.length === 0) {
            errors.team = 'Team cannot be blank'
        }
        if (assignee.length === 0) {
            errors.assignee = 'Assignee cannot be blank'
        }
        if (priority == 0) {
            errors.priority = 'Priority cannot be blank'
        }
        if (status == 0) {
            errors.status = 'Status cannot be blank'
        }


    }


    const handleAddTask = () => {
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        setShowDropdown(null)
        setEditTask(false)
        reset()
        setformErrors(errors)
        setShowFormErrors(false)
    }

    const handleShowChange = (taskIndex) => {
        setShowDropdown(taskIndex)
        setShow(!show)
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    }

    const handleTeamChange = (e) => {
        setTeam(e.target.value)
    }

    const handlePriorityChange = (e) => {
        setPriority(e.target.value)
    }

    const handleAssigneechange = (e) => {
        setAssignee(e.target.value)
    }

    const handleStatusChange = (e) => {
        setStatus(e.target.value)
    }

    
const priorityMap = {
    "P0": 3,
    "P1": 2,
    "P2": 1
}

    const handleSortPriorityChange = (e) => {
        const selectedSortPriority = parseInt(e.target.value)
        
        setSortPriority(selectedSortPriority); 

    
        if (filter) {
            if (selectedSortPriority !== 0) {
                const sortedData = taskData.data.sort((taskA, taskB) => {
                    const priorityValueA = priorityMap[taskA.Priority]
                    const priorityValueB = priorityMap[taskB.Priority]
                    return selectedSortPriority === -1 ? priorityValueB - priorityValueA : priorityValueA - priorityValueB
                })
                setTaskData({ ...taskData, data: sortedData })
            }
        } else {
            if (selectedSortPriority === 0) {
                dispatch(asyncGetTasks())
            } else {
                dispatch(asyncSort({ sortOrder: selectedSortPriority }))
            }
        }
    };

    const handleFilterPriorityChange = (e) => {
        setFilter(true)
        setFilterPriority(e.target.value)

    };



    const handleDateChange = (range) => {
        setStartDateValue(range)
        setFilter(true)
        const startDateFormatted = dayjs(range[0]).format('YYYY-MM-DD');
        const endDateFormatted = dayjs(range[1]).format('YYYY-MM-DD');
        setStartDate(startDateFormatted);
        setEndDate(endDateFormatted);

    };


    const handleFilterAssigneeChange = (e) => {
        setFilter(true)
       setFilterAssignee(e.target.value)
    };

    useEffect(() => {
        applyFilters()
    }, [filterPriority, filterAssignee, startDate, endDate])

    const applyFilters = () => {
        let filters = {};

        if (filterPriority !== '0') {
            filters.Priority = filterPriority;
        }

        if (filterAssignee !== '') {
            filters.Assignees = filterAssignee;
        }

        if (startDate !== '' && endDate !== '') {
            filters.startDate = startDate;
            filters.EndDate = endDate;
        } else if (startDate !== '' && endDate == '') {
            filters.startDate = startDate;
        }

        if (Object.keys(filters).length > 0) {
            dispatch(asyncSortTask(filters));
        } else {
            dispatch(asyncGetTasks());
        }
    };




    const handleEditTask = (data) => {

        setTaskId(data._id)
        setTitle(data.Title)
        setDescription(data.Description)
        setPriority(data.Priority)
        setTeam(data.Team)
        setAssignee(data.Assignees)
        setStatus(data.Status)
        setOpenModal(true)
        setEditTask(true)

    }

    const handleDeleteTask = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(asyncDeleteTask(id, setShow))
            }
        })

    }
    const handleClearFilters = () => {
        setFilterAssignee('')
        setFilterPriority('')
        setStartDate('')
        setEndDate('')
        setFilter(false)
        setStartDateValue([null, null])
        setSortPriority('0')

 }




    const handleAccount = () => {
        setShowLogOut(!showLogOut)
    }

    const formatDate = (date) => {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    const handlelogout = () => {
        localStorage.removeItem('token')
        Swal.fire('Successfully logged out');
        props.history.push('/login');
    };


    const reset = () => {
        setTitle('')
        setDescription('')
        setTeam('')
        setAssignee('')
        setPriority('0')
        setStatus('0')
        setStartDate('')
        setEndDate('')
        setTaskId('')
    }

    const handlesubmit = (e) => {
        e.preventDefault();
        runValidations()
        if (Object.keys(errors).length === 0) {
            setShowFormErrors(false)
            const formData = {
                Title: title,
                Description: description,
                Team: team,
                Assignees: assignee,
                Priority: priority,
                Status: status,
                startDate: formatDate(new Date()),
                EndDate: endDate
            }

            if (status === 'Completed') {
                formData.EndDate = formatDate(new Date());
            }

            if (editTask) {
                dispatch(asyncEditTask(taskId, formData, reset, setEditTask))

            }
            else {
                dispatch(asyncCreateTask(formData, reset))
            }
            handleCloseModal()
        }
        else {
            setformErrors(errors)
            setShowFormErrors(true)
        }
    }
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <h1 className="header">Task Board</h1>
                <Avatar style={{ marginLeft: 'auto', marginRight: '30px', cursor: 'pointer' }} onClick={handleAccount}>
                    <PersonIcon />
                </Avatar>
                {showLogOut && (
                    <div className="accountmodal">
                        <div style={{ borderBottom: '1px solid grey', marginBottom: '6px' }}>
                            <button style={{ color: 'black', padding: '5px', cursor: 'pointer', display: 'block', width: '100%', border: 'none', background: 'none', textAlign: 'left' }}>Profile</button>
                        </div>
                        <div>
                            <button onClick={handlelogout} style={{ color: 'black', padding: '5px', cursor: 'pointer', display: 'block', width: '100%', border: 'none', background: 'none', textAlign: 'left' }}>Logout</button>
                        </div>
                    </div>
                )}
            </div>



            <div className="TaskBoardWrapper">
                <Grid container spacing={2} alignItems="center" style={{ marginTop: '5px' }}>
                    <Grid container spacing={2} alignItems="center" style={{ marginTop: '5px' }}>
                        <Grid item>
                            <h2 className="header2">Filter By:</h2>
                        </Grid>
                        <Grid item>
                            <input type="text" id="assignee" className="filterInput1 " placeholder="Assignee Name" value={filterAssignee} onChange={handleFilterAssigneeChange} />
                        </Grid>
                        <Grid item>
                            <select id="priority" className="filterInput" value={filterPriority} onChange={handleFilterPriorityChange}>
                                <option value='0'>Priority</option>
                                <option value="P0">P0</option>
                                <option value="P1">P1</option>
                                <option value="P2">P2</option>
                            </select>
                        </Grid>
                        <Grid item className="dateRangePickerContainer">
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DemoContainer components={['SingleInputDateRangeField']} >
                                    <style>
                                        {`

                        /* Placeholder color */
                        .MuiInputBase-input::placeholder {
                            color: #858585; /* Change placeholder color */
                            
                        }

                        /* Text color */
                        .MuiInputBase-input {
                            color: #858585 !important; /* Change text color */
                            height: 10px !important; /* Change height */
                          }
                          .css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root{
                            background-color: white !important; /* Change background color */

                          }
                         /* Border color */
                        .MuiOutlinedInput-notchedOutline {
                            border-color: #858585 !important; /* Change border color */
                        }

                        /* Custom styles for DateRangePicker field */
                        .custom-datetime-picker {
                            border-radius: 4px; /* Add border radius for corners */
                        }

                        /* Custom styles for Calendar */
                        .css-1k4oq0i-MuiPaper-root-MuiPickersPopper-paper {
                            background-color: #FEC5E5 !important; /* Change pop-up background color */
                        }
                      `} </style>


                                    <DateRangePicker
                                        slots={{ field: SingleInputDateRangeField }}

                                        selected={startDateValue}
                                        onChange={handleDateChange}
                                        renderInput={(startProps, endProps) => (
                                            <>
                                                <input {...startProps} />
                                                <input {...endProps} />
                                            </>
                                        )}
                                        value={startDateValue}

                                    />
                                </DemoContainer>
                            </LocalizationProvider>

                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleClearFilters} style={{ marginTop: '5px' }} startIcon={<RefreshIcon />}></Button>

                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <button className="AddTaskButton" onClick={handleAddTask}>Add New Task</button>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} >
                        <Grid item>
                            <h2 className="header2">Sort By:</h2>
                        </Grid>
                        <Grid item style={{ marginTop: '10px', marginLeft: '13px' }}>
                            <select id="priority" className="filterInput2" value={sortPriority} onChange={handleSortPriorityChange}>
                                <option value='0'>Priority</option>
                                <option value="1">Low to High</option>
                                <option value="-1">High to low</option>
                            </select>
                        </Grid>
                    </Grid>
                </Grid>

                <Modal open={openmModal} onClose={handleCloseModal}>
                    <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: '90%', maxWidth: 400, bgcolor: "background.paper", border: "2px solid #000", boxShadow: 24, p: 4 }}>
                        <div className="modalHeader">
                            <Typography className="modalTitle">{editTask ? `Edit Task` : 'CREATE A TASK'}</Typography>

                            <div className="modalClose" onClick={handleCloseModal}>
                                <img src={require('../images/XFrame.png')} />
                            </div>

                        </div>

                        <form className="taskForm">
                            <input type="text" placeholder="Title" value={title} readOnly={editTask} style={{ backgroundColor: editTask ? '#F5F5F5' : 'white' }} onChange={handleTitleChange} />
                            <input type="text" placeholder="Description" value={description} readOnly={editTask} style={{ backgroundColor: editTask ? '#F5F5F5' : 'white' }} onChange={handleDescriptionChange} />
                            <input type="text" placeholder="Team" value={team} readOnly={editTask} style={{ backgroundColor: editTask ? '#F5F5F5' : 'white' }} onChange={handleTeamChange} />
                            <input type="text" placeholder="Assignees" value={assignee} readOnly={editTask} style={{ backgroundColor: editTask ? '#F5F5F5' : 'white' }} onChange={handleAssigneechange} />
                            <div style={{ display: 'flex' }}>
                                <select value={priority} onChange={handlePriorityChange}>
                                    <option value='0'>Priority</option>
                                    <option value="P0">P0</option>
                                    <option value="P1">P1</option>
                                    <option value="P2">P2</option>
                                </select>

                                <select value={status} onChange={handleStatusChange} style={{ marginLeft: '4px' }}>
                                    <option value='0'>Status</option>
                                    {editTask ? (
                                        <>
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Deployed">Deployed</option>
                                            <option value="Deferred">Deferred</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <button onClick={handlesubmit}>{editTask ? 'Edit' : 'Submit'}</button>
                                {showFormErrors && (
                                    <Typography style={{ color: 'red', fontSize: '13px', marginTop: '5px' }}>All fields are mandatory</Typography>
                                )}
                            </div>


                        </form>

                    </Box>

                </Modal>

                <Grid container spacing={2} style={{ marginTop: '20px', padding: '15px' }}>
                    
                    <Grid item xs={12} className="responsive-view">
                        <Card className="responsive-view-card" style={{ flex: 1}}>
                            <CardHeader
                                title={<Typography variant="h6" style={{ color: 'white', textAlign: 'center' }}>Pending</Typography>}
                                style={{ backgroundColor: 'grey' }}
                            />
                            <CardContent>
                                {taskData?.data?.map((task, taskIndex) => {
                                    if (task.Status == 'Pending') {
                                        return (
                                            <Card key={taskIndex} style={{ backgroundColor: '#F0F0F0', marginBottom: '15px' }}>

                                                <CardHeader
                                                    title={task.Title}
                                                    action={<button style={{ backgroundColor: '#3944BC', color: '#fff' }}>{task.Priority}</button>} 

                                                />
                                                <Divider style={{ margin: '10px', backgroundColor: 'black', height: '0.5px' }} />
                                                <CardContent>
                                                    <Typography variant="body1">{task.Description}</Typography>
                                                    < div style={{ display: 'flex' }}>
                                                        <Typography variant="body2">{`@${task.Assignees}`}</Typography>
                                                        <div style={{ position: "relative", marginLeft: 'auto' }}>
                                                            <button onClick={() => handleShowChange(taskIndex)} style={{ backgroundColor: '#3944BC', color: 'white', padding: '2px', fontSize: '3px', cursor: 'pointer' }}>
                                                                <MoreVertIcon fontSize="small" />

                                                            </button>

                                                            {(showDropdown == taskIndex && show) && (
                                                                <div style={{ position: 'absolute', top: '20%', left: '30%', transform: 'translateX(-50%)', backgroundColor: '#f9f9f9', padding: '5px', border: '1px solid #ccc', borderRadius: '4px', zIndex: 1 }}>
                                                                    <div style={{ borderBottom: '1px solid black', marginBottom: '5px' }}>
                                                                        <button onClick={() => { handleEditTask(task) }} style={{ color: 'black', padding: '5px', marginBottom: '5px', cursor: 'pointer', display: 'block', width: '100%', border: 'none', background: 'none' }}>Edit</button>
                                                                    </div>
                                                                    <button onClick={() => { handleDeleteTask(task._id) }} style={{ color: 'black', padding: '5px', cursor: 'pointer', display: 'block', width: '100%', border: 'none', background: 'none' }}>Delete</button>
                                                                </div>
                                                            )}


                                                        </div>
                                                    </div>
                                                    <button style={{ backgroundColor: '#3944BC', color: '#fff', width: '100px', textAlign: 'center', marginTop: '15px', marginLeft: '35px', cursor: 'pointer' }}>Assign</button> {/* Button to assign task */}
                                                </CardContent>
                                            </Card>
                                        )
                                    }
                                })}
                            </CardContent>
                        </Card>
                        <Card className="responsive-view-card" style={{ flex: 1}}>
                            <CardHeader
                                title={<Typography variant="h6" style={{ color: 'white', textAlign: 'center' }}>In Progress</Typography>}
                                style={{ backgroundColor: 'orange' }}
                            />
                            <CardContent>
                                {taskData.data?.map((task, taskIndex) => {
                                    if (task.Status == 'In Progress') {
                                        return (
                                            <Card key={taskIndex} style={{ backgroundColor: '#F0F0F0', marginBottom: '15px' }}>

                                                <CardHeader
                                                    title={task.Title}
                                                    action={<button style={{ backgroundColor: '#3944BC', color: '#fff' }}>{task.Priority}</button>} 

                                                />
                                                <Divider style={{ margin: '10px', backgroundColor: 'black', height: '0.5px' }} />
                                                <CardContent>
                                                    <Typography variant="body1">{task.Description}</Typography>
                                                    < div style={{ display: 'flex' }}>
                                                        <Typography variant="body2">{`@${task.Assignees}`}</Typography>
                                                        <div style={{ position: "relative", marginLeft: 'auto' }}>
                                                            <button onClick={() => handleShowChange(taskIndex)} style={{ backgroundColor: '#3944BC', color: 'white', padding: '2px', fontSize: '3px', cursor: 'pointer' }}>
                                                                <MoreVertIcon fontSize="small" />

                                                            </button>

                                                            {(showDropdown == taskIndex && show) && (
                                                                <div style={{ position: 'absolute', top: '20%', left: '30%', transform: 'translateX(-50%)', backgroundColor: '#f9f9f9', padding: '5px', border: '1px solid #ccc', borderRadius: '4px', zIndex: 1 }}>
                                                                    <div style={{ borderBottom: '1px solid black', marginBottom: '5px' }}>
                                                                        <button onClick={() => { handleEditTask(task) }} style={{ color: 'black', padding: '5px', marginBottom: '5px', cursor: 'pointer', display: 'block', width: '100%', border: 'none', background: 'none' }}>Edit</button>
                                                                    </div>
                                                                    <button onClick={() => { handleDeleteTask(task._id) }} style={{ color: 'black', padding: '5px', cursor: 'pointer', display: 'block', width: '100%', border: 'none', background: 'none' }}>Delete</button>
                                                                </div>
                                                            )}


                                                        </div>
                                                    </div>

                                                    <button style={{ backgroundColor: '#3944BC', color: '#fff', width: '100px', textAlign: 'center', marginTop: '15px', marginLeft: '35px', cursor: 'pointer' }}>{task.Status}</button> {/* Button to assign task */}
                                                </CardContent>
                                            </Card>
                                        )
                                    }
                                })}
                            </CardContent>
                        </Card>
                        <Card className="responsive-view-card" style={{ flex: 1}}>
                            <CardHeader
                                title={<Typography variant="h6" style={{ color: 'white', textAlign: 'center' }}>Completed</Typography>}
                                style={{ backgroundColor: 'green' }}
                            />                            <CardContent>
                                {taskData.data?.map((task, taskIndex) => {
                                    if (task.Status == 'Completed') {
                                        return (
                                            <Card key={taskIndex} style={{ backgroundColor: '#F0F0F0', marginBottom: '15px' }}>

                                                <CardHeader
                                                    title={task.Title}
                                                    action={<button style={{ backgroundColor: '#3944BC', color: '#fff' }}>{task.Priority}</button>} 

                                                />
                                                <Divider style={{ margin: '10px', backgroundColor: 'black', height: '0.5px' }} />
                                                <CardContent>
                                                    <Typography variant="body1">{task.Description}</Typography>
                                                    < div style={{ display: 'flex' }}>
                                                        <Typography variant="body2">{`@${task.Assignees}`}</Typography>
                                                        <div style={{ position: "relative", marginLeft: 'auto' }}>
                                                            <button onClick={() => handleShowChange(taskIndex)} style={{ backgroundColor: '#3944BC', color: 'white', padding: '2px', fontSize: '3px', cursor: 'pointer' }}>
                                                                <MoreVertIcon fontSize="small" />

                                                            </button>

                                                            {(showDropdown == taskIndex && show) && (
                                                                <div style={{ position: 'absolute', top: '20%', left: '30%', transform: 'translateX(-50%)', backgroundColor: '#f9f9f9', padding: '5px', border: '1px solid #ccc', borderRadius: '4px', zIndex: 1 }}>
                                                                    <div style={{ borderBottom: '1px solid black', marginBottom: '5px' }}>
                                                                        <button onClick={() => { handleEditTask(task) }} style={{ color: 'black', padding: '5px', marginBottom: '5px', cursor: 'pointer', display: 'block', width: '100%', border: 'none', background: 'none' }}>Edit</button>
                                                                    </div>
                                                                    <button onClick={() => { handleDeleteTask(task._id) }} style={{ color: 'black', padding: '5px', cursor: 'pointer', display: 'block', width: '100%', border: 'none', background: 'none' }}>Delete</button>
                                                                </div>
                                                            )}


                                                        </div>
                                                    </div>
                                                    <button style={{ backgroundColor: '#3944BC', color: '#fff', width: '100px', textAlign: 'center', marginTop: '15px', marginLeft: '35px', cursor: 'pointer' }}>{task.Status}</button> {/* Button to assign task */}
                                                </CardContent>
                                            </Card>
                                        )
                                    }
                                })}
                            </CardContent>
                        </Card>
                        <Card className="responsive-view-card" style={{ flex: 1}}>
                            <CardHeader
                                title={<Typography variant="h6" style={{ color: 'white', textAlign: 'center' }}>Deployed</Typography>}
                                style={{ backgroundColor: 'blue' }}

                            />
                            <CardContent>
                                {taskData.data?.map((task, taskIndex) => {
                                    if (task.Status == 'Deployed') {
                                        return (
                                            <Card key={taskIndex} style={{ backgroundColor: '#F0F0F0', marginBottom: '15px' }}>

                                                <CardHeader
                                                    title={task.Title}
                                                    action={<button style={{ backgroundColor: '#3944BC', color: '#fff' }}>{task.Priority}</button>} 

                                                />
                                                <Divider style={{ margin: '10px', backgroundColor: 'black', height: '0.5px' }} />
                                                <CardContent>
                                                    <Typography variant="body1">{task.Description}</Typography>
                                                    < div style={{ display: 'flex' }}>
                                                        <Typography variant="body2">{`@${task.Assignees}`}</Typography>
                                                        <div style={{ position: "relative", marginLeft: 'auto' }}>
                                                            <button onClick={() => handleShowChange(taskIndex)} style={{ backgroundColor: '#3944BC', color: 'white', padding: '2px', fontSize: '3px', cursor: 'pointer' }}>
                                                                <MoreVertIcon fontSize="small" />

                                                            </button>

                                                            {(showDropdown == taskIndex && show) && (
                                                                <div style={{ position: 'absolute', top: '20%', left: '30%', transform: 'translateX(-50%)', backgroundColor: '#f9f9f9', padding: '5px', border: '1px solid #ccc', borderRadius: '4px', zIndex: 1 }}>
                                                                    <div style={{ borderBottom: '1px solid black', marginBottom: '5px' }}>
                                                                        <button onClick={() => { handleEditTask(task) }} style={{ color: 'black', padding: '5px', marginBottom: '5px', cursor: 'pointer', display: 'block', width: '100%', border: 'none', background: 'none' }}>Edit</button>
                                                                    </div>
                                                                    <button onClick={() => { handleDeleteTask(task._id) }} style={{ color: 'black', padding: '5px', cursor: 'pointer', display: 'block', width: '100%', border: 'none', background: 'none' }}>Delete</button>
                                                                </div>
                                                            )}


                                                        </div>
                                                    </div>
                                                    <button style={{ backgroundColor: '#3944BC', color: '#fff', width: '100px', textAlign: 'center', marginTop: '15px', marginLeft: '35px', cursor: 'pointer' }}>{task.Status}</button> {/* Button to assign task */}
                                                </CardContent>
                                            </Card>
                                        )
                                    }
                                })}
                            </CardContent>
                        </Card>
                        <Card style={{ flex: 1 }}>
                            <CardHeader
                                title={<Typography variant="h6" style={{ color: 'white', textAlign: 'center' }}>Deferred</Typography>}
                                style={{ backgroundColor: 'orange' }}
                            />
                            <CardContent>
                                {taskData.data?.map((task, taskIndex) => {
                                    if (task.Status == 'Deferred') {
                                        return (
                                            <Card key={taskIndex} style={{ backgroundColor: '#F0F0F0', marginBottom: '15px' }}>

                                                <CardHeader
                                                    title={task.Title}
                                                    action={<button style={{ backgroundColor: '#3944BC', color: '#fff' }}>{task.Priority}</button>} 

                                                />
                                                <Divider style={{ margin: '10px', backgroundColor: 'black', height: '0.5px' }} />
                                                <CardContent>
                                                    <Typography variant="body1">{task.Description}</Typography>
                                                    < div style={{ display: 'flex' }}>
                                                        <Typography variant="body2">{`@${task.Assignees}`}</Typography>
                                                        <div style={{ position: "relative", marginLeft: 'auto' }}>
                                                            <button onClick={() => handleShowChange(taskIndex)} style={{ backgroundColor: '#3944BC', color: 'white', padding: '2px', fontSize: '3px', cursor: 'pointer' }}>
                                                                <MoreVertIcon fontSize="small" />

                                                            </button>

                                                            {(showDropdown == taskIndex && show) && (
                                                                <div style={{ position: 'absolute', top: '20%', left: '30%', transform: 'translateX(-50%)', backgroundColor: '#f9f9f9', padding: '5px', border: '1px solid #ccc', borderRadius: '4px', zIndex: 1 }}>
                                                                    <div style={{ borderBottom: '1px solid black', marginBottom: '5px' }}>
                                                                        <button onClick={() => { handleEditTask(task) }} style={{ color: 'black', padding: '5px', marginBottom: '5px', cursor: 'pointer', display: 'block', width: '100%', border: 'none', background: 'none' }}>Edit</button>
                                                                    </div>
                                                                    <button onClick={() => { handleDeleteTask(task._id) }} style={{ color: 'black', padding: '5px', cursor: 'pointer', display: 'block', width: '100%', border: 'none', background: 'none' }}>Delete</button>
                                                                </div>
                                                            )}


                                                        </div>
                                                    </div>
                                                    <button style={{ backgroundColor: '#3944BC', color: '#fff', width: '100px', textAlign: 'center', marginTop: '15px', marginLeft: '35px', cursor: 'pointer' }}>{task.Status}</button> {/* Button to assign task */}
                                                </CardContent>
                                            </Card>
                                        )
                                    }
                                })}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default Home;
