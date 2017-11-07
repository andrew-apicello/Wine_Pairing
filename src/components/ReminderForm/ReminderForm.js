import React from 'react';
import Input from "../Input/Input"
import { Button, Row, Col, FormGroup, ControlLabel, FormControl, Form, Checkbox } from "react-bootstrap"
import axios from 'axios';
import { Redirect } from 'react-router-dom';


class ReminderForm extends React.Component {
constructor() {
  super()
  this.state = {
      _id: "",
      reminders: [],
      reminderTitle: "",
      dayToComplete: [],
      dayToCompleteSun: "",
      dayToCompleteMon: "",
      dayToCompleteTues: "",
      dayToCompleteWed: "",
      dayToCompleteThurs: "",
      dayToCompleteFri: "",
      dayToCompleteSat: "",
      timeToComplete: "",
      timeToCompleteHour: "",
      timeToCompleteMin: "",
      timeToCompleteAmPm: "",
      medicationDosage: "",
      medicationRefillDate: "",
      reminderMessage: "",
      redirectTo: null
    }
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


  handleInputChange = event => {
    // Destructure the name and value properties off of event.target
    // Update the appropriate state
    const { name, value,  } = event.target;

    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    // When the form is submitted, prevent its default behavior, get recipes update the recipes state
    event.preventDefault();

    const patientId = this.props.user.patients[0];
    console.log(this.state.reminderTitle);
    console.log(this.state.dayToComplete);
    console.log(this.state.timeToComplete);
    console.log(this.state.medicationDosage);
    console.log(this.state.medicationRefillDate);
    console.log(this.state.reminderMessage);
    console.log(this.state.timeToCompleteHour);
    console.log(this.state.timeToCompleteMin);
    console.log(this.state.timeToCompleteAmPm);


    if(this.state.dayToCompleteSun) {
      this.state.dayToComplete.push(this.state.dayToCompleteSun);
    } else { this.state.dayToComplete.push(" ") }

    if(this.state.dayToCompleteMon) {
      this.state.dayToComplete.push(this.state.dayToCompleteMon);
    } else { this.state.dayToComplete.push(" ") }

    if(this.state.dayToCompleteTues) {
      this.state.dayToComplete.push(this.state.dayToCompleteTues);      
    } else { this.state.dayToComplete.push(" ") }

    if(this.state.dayToCompleteWed) {
      this.state.dayToComplete.push(this.state.dayToCompleteWed);
    } else { this.state.dayToComplete.push(" ") }

    if(this.state.dayToCompleteThus) {
      this.state.dayToComplete.push(this.state.dayToCompleteThus);
    } else { this.state.dayToComplete.push(" ") }

    if(this.state.dayToCompleteFri) {
      this.state.dayToComplete.push(this.state.dayToCompleteFri); 
    } else { this.state.dayToComplete.push(" ") }

    if(this.state.dayToCompleteSat) {
      this.state.dayToComplete.push(this.state.dayToCompleteSat);
    } else { this.state.dayToComplete.push(" ") }

    console.log(this.state.dayToComplete);

    axios
      .post('/auth/addReminder', {
        _id: this.state._id,
        reminderTitle: this.state.reminderTitle,
        dayToComplete: this.state.dayToComplete,
        timeToComplete: this.state.timeToComplete,
        timeToCompleteHour: this.state.timeToCompleteHour,
        timeToCompleteMin: this.state.timeToCompleteMin,
        timeToCompleteAmPm: this.state.timeToCompleteAmPm,
        medicationDosage: this.state.medicationDosage,
        medicationRefillDate: this.state.medicationRefillDate,
        reminderMessage: this.state.reminderMessage
      })
      .then(response => {
        console.log(response)
        if (!response.data.errmsg) {
          console.log('reminder was added')

          this.setState({
            reminderTitle: "",
            dayToComplete: [],
            dayToCompleteSun: "",
            dayToCompleteMon: "",
            dayToCompleteTues: "",
            dayToCompleteWed: "",
            dayToCompleteThurs: "",
            dayToCompleteFri: "",
            dayToCompleteSat: "",
            timeToComplete: "",
            timeToCompleteHour: "",
            timeToCompleteMin: "",
            timeToCompleteAmPm: "",
            medicationDosage: "",
            medicationRefillDate: "",
            reminderMessage: ""
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
          console.log('error')
        }
      })

  };

  render() {
    if (this.state.redirectTo === "/") {
      return <Redirect to={{ pathname: this.state.redirectTo }} />
    }
    return (
      <div>
        <div className ='container'>
                <Form className='medicationForm'>
                  <h3>Add a reminder</h3>
                  <ControlLabel>Reminder Title:</ControlLabel>
                      <FormControl
                        name="reminderTitle"
                        type="text"
                        value={this.state.reminderTitle}
                        onChange={this.handleInputChange}
                        placeholder="Type i.e. Medication Reminder"
                      />
                    <br />
                    <ControlLabel>Choose which days medications must be taken:</ControlLabel>
                      <Checkbox inline
                        name="dayToCompleteSun"
                        value="Sunday"
                        onChange={this.handleInputChange}
                      >
                        Sunday
                      </Checkbox>
                      <Checkbox inline 
                        name="dayToCompleteMon"
                        value="Monday"
                        onChange={this.handleInputChange}
                      >
                        Monday
                      </Checkbox>
                      <Checkbox inline
                        name="dayToCompleteTues"
                        value="Tuesday"
                        onChange={this.handleInputChange}
                      >
                        Tuesday
                      </Checkbox>
                      <Checkbox inline
                        name="dayToCompleteWed"
                        value="Wednesday"
                        onChange={this.handleInputChange}
                      >
                        Wednesday
                      </Checkbox>
                      <Checkbox inline
                        name="dayToCompleteThurs"
                        value="Thursday"
                        onChange={this.handleInputChange}
                      >
                        Thursday
                      </Checkbox>
                      <Checkbox inline
                        name="dayToCompleteFri"
                        value="Friday"
                        onChange={this.handleInputChange}
                      >
                        Friday
                      </Checkbox>
                      <Checkbox inline
                        name="dayToCompleteSat"
                        value="Saturday"
                        onChange={this.handleInputChange}
                      >
                        Saturday
                      </Checkbox>
                    </Form>
                      <br /><br />
              <Form inline>
              <ControlLabel>Hour</ControlLabel>
              {' '}
                <FormControl
                  name="timeToCompleteHour"
                  componentClass="select"
                  value={this.state.timeToCompleteHour}
                  onChange={this.handleInputChange}
                >
                  <option value="">Select Hour</option>
                  <option value="0">00:</option>
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
            <Form>
              <br />
              <ControlLabel>Medication Dosage:</ControlLabel>
                <FormControl
                  name="medicationDosage"
                  value={this.state.medicationDosage}
                  onChange={this.handleInputChange}
                  placeholder="Medication Quantity (if a medication reminder)"
                />
              <br />
              <ControlLabel>Medication Refill Date:</ControlLabel>
                <FormControl
                  name="medicationRefillDate"
                  value={this.state.medicationRefillDate}
                  onChange={this.handleInputChange}
                  placeholder="Refill Date (if a medication reminder)"
                />
              <br />
             <ControlLabel>Message</ControlLabel>
                <FormControl
                  name="reminderMessage"
                  value={this.state.reminderMessage}
                  onChange={this.handleInputChange}
                  placeholder="Message"
                />
              <br />
              <Button bsStyle="primary"
                onClick={this.handleFormSubmit}
                type="success"
                className="input-lg"
              >
                Add Reminder
              </Button>
              </Form>
          <Row>
            <div className='col-md-12'>
            <p>Current Reminders:</p>

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
                  {reminder.dayToComplete[1] === "Monday" && reminder.medicationDosage && reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Medication Qty: " + reminder.medicationQuantity + " Medication Refill Date: " + reminder.medicationRefillDate + " Message: " + reminder.reminderMessage ) : ""}
                  {reminder.dayToComplete[1] === "Monday" && !reminder.medicationDosage && !reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Message: " + reminder.reminderMessage ) : ""}
                  </div>
                ))}



                <br/>
                <hr/>
                <p>TUESDAY: </p>
                {this.state.reminders.map(reminder => (
                  <div key={reminder._id} id={reminder._id}>
                  {reminder.dayToComplete[2] === "Tuesday" && reminder.medicationDosage && reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Medication Qty: " + reminder.medicationQuantity + " Medication Refill Date: " + reminder.medicationRefillDate + " Message: " + reminder.reminderMessage ) : ""}
                  {reminder.dayToComplete[2] === "Tuesday" && !reminder.medicationDosage && !reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Message: " + reminder.reminderMessage ) : ""}          
                  </div>
                ))}



                <br/>
                <hr/>
                <p>WEDNESDAY: </p>
                {this.state.reminders.map(reminder => (
                  <div key={reminder._id} id={reminder._id}>
                  {reminder.dayToComplete[3] === "Wednesday" && reminder.medicationDosage && reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Medication Qty: " + reminder.medicationQuantity + " Medication Refill Date: " + reminder.medicationRefillDate + " Message: " + reminder.reminderMessage ) : ""}
                  {reminder.dayToComplete[3] === "Wednesday" && !reminder.medicationDosage && !reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Message: " + reminder.reminderMessage ) : ""}
                  </div>
                ))}



                <br/>
                <hr/>
                <p>THURSDAY: </p>
                {this.state.reminders.map(reminder => (
                  <div key={reminder._id} id={reminder._id}>
                  {reminder.dayToComplete[4] === "Thursday" && reminder.medicationDosage && reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Medication Qty: " + reminder.medicationQuantity + " Medication Refill Date: " + reminder.medicationRefillDate + " Message: " + reminder.reminderMessage ) : ""}
                  {reminder.dayToComplete[4] === "Thursday" && !reminder.medicationDosage && !reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Message: " + reminder.reminderMessage ) : ""}
                  </div>
                ))}



                <br/>
                <hr/>
                <p>FRIDAY: </p>
                {this.state.reminders.map(reminder => (
                  <div key={reminder._id} id={reminder._id}>
                  {reminder.dayToComplete[5] === "Friday" && reminder.medicationDosage && reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Medication Qty: " + reminder.medicationQuantity + " Medication Refill Date: " + reminder.medicationRefillDate + " Message: " + reminder.reminderMessage ) : ""}
                  {reminder.dayToComplete[5] === "Friday" && !reminder.medicationDosage && !reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Message: " + reminder.reminderMessage ) : ""}         
                  </div>
                ))}



                <br/>
                <hr/>
                <p>SATURDAY: </p>
                {this.state.reminders.map(reminder => (
                  <div key={reminder._id} id={reminder._id}>
                  {reminder.dayToComplete[6] === "Saturday" && reminder.medicationDosage && reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Medication Qty: " + reminder.medicationQuantity + " Medication Refill Date: " + reminder.medicationRefillDate + " Message: " + reminder.reminderMessage ) : ""}
                  {reminder.dayToComplete[6] === "Saturday" && !reminder.medicationDosage && !reminder.medicationRefillDate ? (reminder.timeToComplete + " To Do: " + reminder.reminderTitle + " Message: " + reminder.reminderMessage ) : ""}
                  </div>
                ))}
              </div>
            </div>
          </Row>
        </div>
      </div>
    );
  }
}

export default ReminderForm;