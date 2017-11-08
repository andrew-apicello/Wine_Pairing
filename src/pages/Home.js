import React from 'react';
import PatientForm from '../components/PatientForm';
import DisplayReminders from '../components/DisplayReminders';
import Clock from "../components/Clock";
import Carousel from "../components/Carousel";
import Header from '../components/Header/Header'

const Home = props => {
		let user = props.user || 'no user';
	// If a user exists and if that user has patients, display the patient's reminders
	if (props.user && props.user.patients.length > 0) {
		return (
			<div className="container">
				<div className="Home">
					<Header user={user} />
					<Clock />
					<DisplayReminders user = {user}/>
				</div>
			</div>
		)
	} 
	// Display the add a patient form if the user doesn't have a saved patient
	else if (props.user && props.user.patients.length === 0) {
		return (
			<div className="container">
				<div className="Home">
							{console.log(props.user)}
					<PatientForm />
				</div>
			</div>
		)
	} 

	else if (!props.user) {
		return (
			<div>				
				<Carousel />
				<div className="Home">

				<h1>Peace of Mind</h1>
				<p>I am not logged in</p>
			</div>
			</div>
		)
	}
}

export default Home