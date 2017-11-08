import React from 'react';
import { Button, Row, Col, ControlLabel, FormControl, Form, Checkbox, Panel } from "react-bootstrap"
import axios from 'axios';
import "./ReminderForm.css"
import MilitaryTime from '../../Utils/MilitaryTime.js';
import { Redirect } from 'react-router-dom';
import {WarningBanner} from "../Alerts"
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';


class ReminderForm extends React.Component {
constructor() {
  super()
  this.state = {
      _id: "",
      reminders: [],
      reminderTitle: "",
      titleFlag: false,
      timeToComplete: "",
      timeFlag: false,
      timeToCompleteHour: "",
      timeToCompleteMin: "",
      timeToCompleteAmPm: "",
      medicationDosage: "",
      medicationRefillDate: "",
      reminderMessage: "",
      redirectTo: null,
      selected: [],
      startDate: moment()
    }
    this.handleChange = this.handleChange.bind(this);
}
  componentDidMount() {
    const id = this.props.user._id;
    const patientId = this.props.user.patients[0];

    console.log("patientId: " + patientId);

    axios.get('/auth/patients/' + id).then(response => {
      console.log(response.data)
      if (response.data.length > 0) {
        this.setState({
          _id: response.data[0]._id
        })
      } else {
        alert("Please add a patient before adding a patient profile.")
        this.setState({
          redirectTo: "/"
        })

      };
    });

    axios.get('/auth/reminders/' + patientId).then(response => {
      console.log(response.data)
      if (response.data) {
        this.setState({
          reminders: response.data
        })
      };
    });
  }
  
  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  handleInputChange = event => {
    // Destructure the name and value properties off of event.target
    // Update the appropriate state
    let { name, value } = event.target;

    console.log(event.target);

    if(event.target.name === "dayToComplete" && event.target.checked) {
      this.state.selected.push(event.target.value);
      console.log(this.state.selected);
    } else if(event.target.name === "dayToComplete" && !event.target.checked) {
      let currentValue = event.target.value;
      let index = this.state.selected.indexOf(currentValue);
      console.log(index);
      this.state.selected.splice(index, 1);
      console.log(this.state.selected);
    }

    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    const patientId = this.props.user.patients[0];
    console.log(this.state.reminderTitle);
    console.log(this.state.dayToComplete);
    console.log(this.state.timeToComplete);
    console.log(this.state.timeToCompleteHour);
    console.log(this.state.timeToCompleteMin);
    console.log(this.state.timeToCompleteAmPm);
    console.log(this.state.medicationDosage);
    console.log(this.state.medicationRefillDate);
    console.log(this.state.reminderMessage);

    let hours = this.state.timeToCompleteHour;
    let minutes = this.state.timeToCompleteMin;
    let amPm = this.timeToCompleteAmPm;

    let convertedTime = MilitaryTime.convertStandardToMilitaryTime(hours,minutes,amPm);

    let convertedTimeAdded = addTime(hours,minutes,amPm);

    function addTime(hours,minutes,amPm){

      let militaryTime = MilitaryTime.convertStandardToMilitaryTime(hours,minutes,amPm)
        hours = parseInt(militaryTime.split(":")[0])
        minutes = parseInt(militaryTime.split(":")[1])

      if (minutes == 0){
          minutes = minutes + 30
      } else {
          hours = hours + 1
          minutes = "00"

        if (hours == 24){
              hours = 0;
        }
      }
        return hours + ":" + minutes
    }

    if (this.state.reminderTitle){

      this.setState({
        titleFlag: false,
      })
    }

    if (!this.state.reminderTitle){
      this.setState({
        titleFlag: true,
        redirectTo: ""
      })
    }

    if (this.state.timeToCompleteHour && this.state.timetoCompleteMin && this.state.timeToCompleteAmPm){

      this.setState({
        timeFlag: false,
      })
    }

    if (!this.state.timeToCompleteHour || this.state.timetoCompleteMin || this.state.timeToCompleteAmPm){
      this.setState({
        timeFlag: true,
        redirectTo: ""
      })
    }

    if(this.state.reminderTitle && this.state.timeToCompleteHour && this.state.timetoCompleteMin && this.state.timeToCompleteAmPm)

    axios
      .post('/auth/addReminder', {
        _id: this.state._id,
        reminderTitle: this.state.reminderTitle,
        dayToComplete: this.state.selected,
        timeToComplete: convertedTime,
        medicationDosage: this.state.medicationDosage,
        medicationRefillDate: this.state.medicationRefillDate,
        reminderMessage: this.state.reminderMessage,
        receiveResponseBy: convertedTimeAdded
      })
      .then(response => {
        console.log(response)
        if (!response.data.errmsg) {
          console.log('reminder was added')

          this.setState({
            reminderTitle: "",
            timeToComplete: "",
            timeToCompleteHour: "",
            timeToCompleteMin: "",
            timeToCompleteAmPm: "",
            medicationDosage: "",
            medicationRefillDate: "",
            reminderMessage: "",
            selected: []
          });

      axios.get('/auth/reminders/' + patientId).then(response => {
        console.log("Getting new reminders...")
        console.log(response.data)
          if (response.data) {
            this.setState({
              reminders: response.data
            })
          };
      });

        } else {
          console.log('error');
        }
      })

  };

  render() {
    if (this.state.redirectTo === "/") {
      return <Redirect to={{ pathname: this.state.redirectTo }} />
    }
    return (
      <Row>
        <Col md={7}>
          <h3>Current Reminders:</h3>

          {this.state.reminders.length ? (
            <div>
              <br/>
              <p>SUNDAY: </p>
              {this.state.reminders.map(reminder => (
                <div key={reminder._id} id={reminder._id}>
                {reminder.dayToComplete[0] === "Sunday" && reminder.medicationDosage && reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Medication Qty: " + reminder.medicationQuantity + " Medication Refill Date: " + reminder.medicationRefillDate + " Message: " + reminder.reminderMessage ) : ""}
                {reminder.dayToComplete[0] === "Sunday" && !reminder.medicationDosage && !reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Message: " + reminder.reminderMessage ) : ""}
                </div>
              ))}
            
              <br/>
              <hr/>
              <p>MONDAY: </p>
              {this.state.reminders.map(reminder => (
                <div key={reminder._id} id={reminder._id}>
                {reminder.dayToComplete === "Monday" && reminder.medicationQuantity && reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Medication Qty: " + reminder.medicationQuantity + " Medication Refill Date: " + reminder.medicationRefillDate + " Message: " + reminder.reminderMessage ) : ""}
                {reminder.dayToComplete === "Monday" && !reminder.medicationQuantity && !reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Message: " + reminder.reminderMessage ) : ""}
                </div>
              ))}

              <br/>
              <hr/>
              <p>TUESDAY: </p>
              {this.state.reminders.map(reminder => (
                <div key={reminder._id} id={reminder._id}>
                {reminder.dayToComplete === "Tuesday" && reminder.medicationQuantity && reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Medication Qty: " + reminder.medicationQuantity + " Medication Refill Date: " + reminder.medicationRefillDate + " Message: " + reminder.reminderMessage ) : ""}
                {reminder.dayToComplete === "Tuesday" && !reminder.medicationQuantity && !reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Message: " + reminder.reminderMessage ) : ""}          
                </div>
              ))}
              <br/>
              <hr/>
              <p>WEDNESDAY: </p>
              {this.state.reminders.map(reminder => (
                <div key={reminder._id} id={reminder._id}>
                {reminder.dayToComplete === "Wednesday" && reminder.medicationQuantity && reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Medication Qty: " + reminder.medicationQuantity + " Medication Refill Date: " + reminder.medicationRefillDate + " Message: " + reminder.reminderMessage ) : ""}
                {reminder.dayToComplete === "Wednesday" && !reminder.medicationQuantity && !reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Message: " + reminder.reminderMessage ) : ""}
                </div>
              ))}
              <br/>
              <hr/>
              <p>THURSDAY: </p>
              {this.state.reminders.map(reminder => (
                <div key={reminder._id} id={reminder._id}>
                {reminder.dayToComplete === "Thursday" && reminder.medicationQuantity && reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Medication Qty: " + reminder.medicationQuantity + " Medication Refill Date: " + reminder.medicationRefillDate + " Message: " + reminder.reminderMessage ) : ""}
                {reminder.dayToComplete === "Thursday" && !reminder.medicationQuantity && !reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Message: " + reminder.reminderMessage ) : ""}
                </div>
              ))}

              <br/>
              <hr/>
              <p>FRIDAY: </p>
              {this.state.reminders.map(reminder => (
                <div key={reminder._id} id={reminder._id}>
                {reminder.dayToComplete === "Friday" && reminder.medicationQuantity && reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Medication Qty: " + reminder.medicationQuantity + " Medication Refill Date: " + reminder.medicationRefillDate + " Message: " + reminder.reminderMessage ) : ""}
                {reminder.dayToComplete === "Friday" && !reminder.medicationQuantity && !reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Message: " + reminder.reminderMessage ) : ""}         
                </div>
              ))}

              <br/>
              <hr/>
              <p>SATURDAY: </p>
              {this.state.reminders.map(reminder => (
                <div key={reminder._id} id={reminder._id}>
                {reminder.dayToComplete === "Saturday" && reminder.medicationQuantity && reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Medication Qty: " + reminder.medicationQuantity + " Medication Refill Date: " + reminder.medicationRefillDate + " Message: " + reminder.reminderMessage ) : ""}
                {reminder.dayToComplete === "Saturday" && !reminder.medicationQuantity && !reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Message: " + reminder.reminderMessage ) : ""}
                </div>
              ))}
            </div>
          ) : (
              <p>No Reminders Scheduled</p>
            )}
          </Col>
          <Col md={5}>
            <Panel className="addMedsPanel">
              <h3>Add a New Reminder</h3>
              <Form className="medicationForm">
              <ControlLabel>Reminder Title:</ControlLabel>
                <FormControl
                  name="reminderTitle"
                  type="text"
                  value={this.state.reminderTitle}
                  onChange={this.handleInputChange}
                  placeholder="Type i.e. Medication Reminder, Dr. Appt..."
                />
                <WarningBanner 
                  warn={this.state.titleFlag}
                />
              <br />
              <ControlLabel>Day(s) in which medication must be taken:</ControlLabel>
                <br />
                <Checkbox inline
                  name="dayToComplete"
                  value="Sunday"
                  onChange={this.handleInputChange}
                >
                  Sunday
                </Checkbox>
                <Checkbox inline 
                  name="dayToComplete"
                  value="Monday"
                  onChange={this.handleInputChange}
                >
                  Monday
                </Checkbox>
                <Checkbox inline
                  name="dayToComplete"
                  value="Tuesday"
                  onChange={this.handleInputChange}
                >
                  Tuesday
                </Checkbox>
                <Checkbox inline
                  name="dayToComplete"
                  value="Wednesday"
                  onChange={this.handleInputChange}
                >
                  Wednesday
                </Checkbox>
                <Checkbox inline
                  name="dayToComplete"
                  value="Thursday"
                  onChange={this.handleInputChange}
                >
                  Thursday
                </Checkbox>
                <Checkbox inline
                  name="dayToComplete"
                  value="Friday"
                  onChange={this.handleInputChange}
                >
                  Friday
                </Checkbox>
                <Checkbox inline
                  name="dayToComplete"
                  value="Saturday"
                  onChange={this.handleInputChange}
                >
                  Saturday
                </Checkbox>
            </Form>
              <br />
            <Form inline className="medicationForm">
                <ControlLabel>Hour:</ControlLabel>
                {' '}
                  <FormControl
                    className="dropdownFields"
                    name="timeToCompleteHour"
                    componentClass="select"
                    value={this.state.timeToCompleteHour}
                    onChange={this.handleInputChange}
                  >
                    <option value="">Select Hour</option>
                    <option value="1">01:</option>
                    <option value="2">02:</option>
                    <option value="3">03:</option>
                    <option value="4">04:</option>
                    <option value="5">05:</option>
                    <option value="6">06:</option>
                    <option value="7">07:</option>
                    <option value="8">08:</option>
                    <option value="9">09:</option>
                    <option value="10">10:</option>
                    <option value="11">11:</option>
                    <option value="12">12:</option>
                  </FormControl>
                <ControlLabel>Min: </ControlLabel>
                  <FormControl
                    className="dropdownFields"
                    name="timeToCompleteMin"
                    componentClass="select"
                    value={this.state.timeToCompleteMin}
                    onChange={this.handleInputChange}
                    placeholder="Time"
                  >
                    <option value="">Select Min</option>
                    <option value="00">:00</option>
                    <option value="30">:30</option>
                  </FormControl>
                  <ControlLabel>AM/PM</ControlLabel>
                  <FormControl
                    className="dropdownFields"
                    name="timeToCompleteAmPm"
                    componentClass="select"
                    value={this.state.timeToCompleteAmPm}
                    onChange={this.handleInputChange}
                    placeholder="Time"
                  >
                    <option value="">AM/PM</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </FormControl>
              </Form>
              <WarningBanner 
                warn={this.state.timeFlag}
              />
              <br />
              <Form inline className="medicationForm">
                <ControlLabel>Dosage:</ControlLabel>
                  <FormControl
                    className="dropdownFields"
                    name="medicationQuantity"
                    value={this.state.medicationDosage}
                    onChange={this.handleInputChange}
                    placeholder="(if a med reminder)"
                  />
                <ControlLabel>Refill Date:</ControlLabel>
                  <FormControl
                    className="dropdownFields"
                    name="medicationRefillDate"
                    value={this.state.medicationRefillDate}
                    onChange={this.handleInputChange}
                    placeholder="(if a med reminder)"
                  />
                <ControlLabel>Refill Date:</ControlLabel>
                  <DatePicker
                    name="medicationRefillDate"
                    selected={this.state.startDate}
                    onChange={this.handleChange}
                  />
              </Form>
                <br />
              <Form className="medicationForm">
               <ControlLabel>Message</ControlLabel>
                  <FormControl
                    name="reminderMessage"
                    componentClass="textarea"
                    value={this.state.reminderMessage}
                    onChange={this.handleInputChange}
                    placeholder="Message"
                  />
                <br />
                <Button bsStyle="success"
                  onClick={this.handleFormSubmit}
                  type="success"
                  className="addReminderBtn"
                  block
                >
                  Add Reminder
                </Button>
              </Form>
            </Panel>
        </Col>
      </Row>
    );
  }
}

export default ReminderForm;