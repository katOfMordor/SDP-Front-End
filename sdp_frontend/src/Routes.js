import React from 'react';
import {Switch,Route} from 'react-router-dom'
import Scheduler from './components/Scheduler';
import Timetable from './components/Timetable';
import Login from './components/Login';
import allStudents from './components/allStudents';

export default class Routes extends React.Component{
    render(){
        return(
            <Switch>
                <Route exact path="/" component={Scheduler}/>
                <Route path="/timetable" component={Timetable}/>
                <Route path="/login" component={Login}/>
                <Route path="/allstudents" component={allStudents}/>
            </Switch>
        )
    }
}