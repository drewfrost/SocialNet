import React, {useState, useEffect, Fragment} from 'react';
import axios from 'axios';
import {Container} from 'semantic-ui-react';
import {IActivity} from '../models/activity';
import Navbar from '../../features/nav/Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
        null
    );

    const [editMode, setEditMode] = useState(false);

    const handleSelectActivity = (id: string) => {
        setSelectedActivity(activities.filter(activity => activity.id === id)[0]);
        setEditMode(false);
    };

    const handleOpenCreateForm = () => {
        setSelectedActivity(null);
        setEditMode(true);
    };

    const handleCreateActivity = (activity: IActivity) => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
    };

    const handleEditActivity = (activity: IActivity) => {
        setActivities([...activities.filter(a => a.id !== activity.id), activity]);
        setSelectedActivity(activity);
        setEditMode(false);
    };
    
    const handleDeleteActivity = (id: string) => {
      setActivities([...activities.filter(a => a.id !== id)])
    }

    useEffect(() => {
        axios
            .get<IActivity[]>('http://localhost:5000/api/activities')
            .then(response => {
                let activities: IActivity[] = [];
                response.data.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    activities.push(activity);
                });
                setActivities(activities);
            });
    }, []);

    return (
        <Fragment>
            <Navbar openCreateForm={handleOpenCreateForm}/>
            <Container style={{marginTop: '7em'}}>
                <ActivityDashboard
                    setSelectedActivity={setSelectedActivity}
                    selectActivity={handleSelectActivity}
                    selectedActivity={selectedActivity}
                    activities={activities}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    createActivity={handleCreateActivity}
                    editActivity={handleEditActivity}
                    deleteActivity={handleDeleteActivity}
                />
            </Container>
        </Fragment>
    );
};

export default App;
