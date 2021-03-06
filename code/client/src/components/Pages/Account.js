import React from 'react';
import './Account.css';
import WorldMapImage from '../../images/Map_soon.svg';
import avatar from '../../images/Avatar.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import ComingSoonIcon from '../../images/png_icons/comingSoonIcon.svg';
/* NOTES: We want to export the main component of the page so that everything renders properly
This means that we will display other components within the main component. 
We will need to have a main class that is the default export. This should be the AccountPage class.
Every part that appears on the page will need to be a separate component.
For instance, the Account Page will contain a UserForm, a UserProfileData section, and Posts
that are generated when the Form is used to add Trip Data to DoMAD. */


/* class with API pull of user info Displays UserData in upper left corner of AccountPage */
class User extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		firstName: "",
		lastName: "", 
		signupDate: "",
		tripsCount: "",
		donationCount: "",	
		
	};
	}

	getUser = async () => {
		const response = await fetch('/api/user/profile/profile');
		const data = await response.json();
		if (response.status !== 200) {
			throw Error(response.message)
		}
		console.log(data);
		return data;
	};

	componentDidMount() {
		this.getUser(this)
			.then(res => {
				var signUpDate = new Date(res.userData.signupDate)
				this.setState({
					firstName: res.userData.firstName,
					lastName: res.userData.lastName,
					signupDate: (signUpDate.getMonth() + 1) + "/" + signUpDate.getDate() + "/" + signUpDate.getFullYear(),
					tripsCount: res.userData.tripsCount ? res.userData.tripsCount : "None",
					donationCount: res.userData.donationCount ? res.userData.donationCount : "None",
          
										
				});
			})
			.catch(err => console.log(err));
	}

	render() {
		return(
		<div className="UserInfo">
				<div className="user-info-row">
					<div className="avatar-column">
							<div className='UserInfo-avatar'>
							<img src={ avatar } alt= "avatar" height='128px'  />
							</div>
					</div>
					<div className="user-info-column">  
						<div className="UserInfo-name">{this.state.firstName + " " + this.state.lastName}</div>
						<div className='UserInfo-signupDate'>DoMAD Member Since: {this.state.signupDate}</div>
						<div className="UserInfo-tripsCount">Number of trips: {this.state.tripsCount}</div>
						<div className="UserInfo-donationsCount">Number of Donations: {this.state.donationCount}</div>
					</div>
				</div>
			</div>
		)}
}

/* The Form a User fills out when they want to report a trip and donation */
class UserTripForm extends React.Component {
	constructor(props) {
		super(props);	
		this.userID = this.props.userID;
		this.reloadAccount = this.props.reloadAccount;
		this.state = {
			date: "",
			country: "",
			city: "",
			donationItem: "",
			donationCategory: "",
			donationRecipient: "",
			rating: "",
			suggestedDonationItem: "",
			donationCategorySuggested: "",
			itemDescription: "",
			description: "",
			isPrivate: false,
		};
		this.accountChangeHandler = this.accountChangeHandler.bind(this);		
	}
	
	accountChangeHandler(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		console.log(name, value);
		this.setState({
		  [name]: value
		});
	  }
	

	reportTrip = async () => {
		// TODO: Create support for adding multiple items at a time
		var donations = []
		// Each donation will be added to the list of donations above in the following format.
		var newDonation = {
		  "itemName": this.state.donationItem,
		  "category": this.state.donationCategory,
		  "rating": this.state.rating, 
		  "suggestion": false,
		  "organization": false // Check in to too if we are only doing this and no organization information
		}
		var newSuggestedDonation = {
		  "itemName": this.state.suggestedDonationItem,
		  "category": this.state.donationCategorySuggested,
		  "rating": this.state.rating,
		  "suggestion": true,
		  "organization": false,
		  "itemDescription": this.state.itemDescription
		}
		donations.push(newDonation);
		donations.push(newSuggestedDonation);
		const reqBody = {
		  
		  "tripDate": this.state.tripDate,
		  "donations": donations,
		  "notes": this.state.description,
		  "isPrivate": this.state.isPrivate,
		  "country": this.state.country,
		  "city": this.state.city 
		}
		console.log(reqBody);
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(reqBody)
		  };
		  const response = await fetch('/api/user/trip/report', requestOptions);
		  const data = await response.json();
		  if (response.status !== 201) {
			throw Error(data.message)
		  }

		  return data;
		};

		onSubmit = (e) => {
		  e.preventDefault()
		  console.log(this.state);
		  console.log('SUBMIT');

		  this.reportTrip()
			.then(res => {
			  console.log(res)
			  this.reloadAccount();
			})
			.catch(err => console.log(err)); // TODO: Handle all errors and relay to user
		}

	render() {
		return (

		<form onSubmit={this.onSubmit}>
			<ul className="flex-outer">
				<li>{/* Trip Date Entry */}
					<label name="date">When did this trip occur?</label>
					<input required = "Required" id="tripDate" name='tripDate' type="date" onChange={this.accountChangeHandler } />
				</li>
				
				<li>{/* Country Selection List */}
					<label name="country">Where did you go?</label>
					<select className="select-css" required = "Required" name="country" value={this.state.value} onChange={this.accountChangeHandler}>
						<option value="Afghanistan">Afghanistan</option>
						<option value="Albania">Albania</option>
						<option value="Algeria">Algeria</option>
						<option value="American Samoa">American Samoa</option>
						<option value="Andorra">Andorra</option>
						<option value="Angola">Angola</option>
						<option value="Anguilla">Anguilla</option>
						<option value="Antigua and Barbuda">Antigua and Barbuda</option>
						<option value="Argentina">Argentina</option>
						<option value="Armenia">Armenia</option>
						<option value="Aruba">Aruba</option>
						<option value="Australia">Australia</option>
						<option value="Austria">Austria</option>
						<option value="Azerbaijan">Azerbaijan</option>
						<option value="Bahamas">Bahamas</option>
						<option value="Bahrain">Bahrain</option>
						<option value="Bangladesh">Bangladesh</option>
						<option value="Barbados">Barbados</option>
						<option value="Belarus">Belarus</option>
						<option value="Belgium">Belgium</option>
						<option value="Belize">Belize</option>
						<option value="Benin">Benin</option>
						<option value="Bermuda">Bermuda</option>
						<option value="Bonaire, Sint Eustatius and Saba">Bonaire, Sint Eustatius and Saba</option>
						<option value="Bhutan">Bhutan</option>
						<option value="Bolivia, Plurinational State of">Bolivia, Plurinational State of</option>
						<option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
						<option value="Botswana">Botswana</option>
						<option value="Brazil">Brazil</option>
						<option value="Virgin Islands, British">Virgin Islands, British</option>
						<option value="Brunei Darussalam">Brunei Darussalam</option>
						<option value="Bulgaria">Bulgaria</option>
						<option value="Burkina Faso">Burkina Faso</option>
						<option value="Burundi">Burundi</option>
						<option value="Cabo Verde">Cabo Verde</option>
						<option value="Cambodia">Cambodia</option>
						<option value="Cameroon">Cameroon</option>
						<option value="Canada">Canada</option>
						<option value="Cayman Islands">Cayman Islands</option>
						<option value="Central African Republic">Central African Republic</option>
						<option value="Chad">Chad</option>
						<option value="Chile">Chile</option>
						<option value="China">China</option>
						<option value="Colombia">Colombia</option>
						<option value="Comoros">Comoros</option>
						<option value="Congo">Congo</option>
						<option value="Cook Islands">Cook Islands</option>
						<option value="Costa Rica">Costa Rica</option>
						<option value="Côte d'Ivoire">Côte d'Ivoire</option>
						<option value="Croatia">Croatia</option>
						<option value="Cuba">Cuba</option>
						<option value="Netherlands">Netherlands</option>
						<option value="Cyprus">Cyprus</option>
						<option value="Czechia">Czechia</option>
						<option value="Denmark">Denmark</option>
						<option value="Djibouti">Djibouti</option>
						<option value="Dominica">Dominica</option>
						<option value="Dominican Republic">Dominican Republic</option>
						<option value="Ecuador">Ecuador</option>
						<option value="Egypt">Egypt</option>
						<option value="El Salvador">El Salvador</option>
						<option value="Equatorial Guinea">Equatorial Guinea</option>
						<option value="Eritrea">Eritrea</option>
						<option value="Estonia">Estonia</option>
						<option value="Eswatini">Eswatini</option>
						<option value="Ethiopia">Ethiopia</option>
						<option value="Faroe Islands">Faroe Islands</option>
						<option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
						<option value="Fiji">Fiji</option>
						<option value="Finland">Finland</option>
						<option value="France">France</option>
						<option value="French Guiana">French Guiana</option>
						<option value="French Polynesia">French Polynesia</option>
						<option value="Gabon">Gabon</option>
						<option value="Gambia">Gambia</option>
						<option value="Georgia">Georgia</option>
						<option value="Germany">Germany</option>
						<option value="Ghana">Ghana</option>
						<option value="Gibraltar">Gibraltar</option>
						<option value="Greece">Greece</option>
						<option value="Greenland">Greenland</option>
						<option value="Grenada">Grenada</option>
						<option value="Guam">Guam</option>
						<option value="Guatemala">Guatemala</option>
						<option value="Guinea">Guinea</option>
						<option value="Guinea-Bissau">Guinea-Bissau</option>
						<option value="Guyana">Guyana</option>
						<option value="Haiti">Haiti</option>
						<option value="Honduras">Honduras</option>
						<option value="Hungary">Hungary</option>
						<option value="Iceland">Iceland</option>
						<option value="India">India</option>
						<option value="Indonesia">Indonesia</option>
						<option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
						<option value="Iraq">Iraq</option>
						<option value="Ireland">Ireland</option>
						<option value="Isle of Man">Isle of Man</option>
						<option value="Israel">Israel</option>
						<option value="Italy">Italy</option>
						<option value="Jamaica">Jamaica</option>
						<option value="Japan">Japan</option>
						<option value="Jordan">Jordan</option>
						<option value="Kazakhstan">Kazakhstan</option>
						<option value="Kenya">Kenya</option>
						<option value="Kiribati">Kiribati</option>
						<option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
						<option value="Serbia">Serbia</option>
						<option value="Kuwait">Kuwait</option>
						<option value="Kyrgyzstan">Kyrgyzstan</option>
						<option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
						<option value="Latvia">Latvia</option>
						<option value="Lebanon">Lebanon</option>
						<option value="Lesotho">Lesotho</option>
						<option value="Liberia">Liberia</option>
						<option value="Libya">Libya</option>
						<option value="Liechtenstein">Liechtenstein</option>
						<option value="Lithuania">Lithuania</option>
						<option value="Luxembourg">Luxembourg</option>
						<option value="North Macedonia">North Macedonia</option>
						<option value="Madagascar">Madagascar</option>
						<option value="Malawi">Malawi</option>
						<option value="Malaysia">Malaysia</option>
						<option value="Maldives">Maldives</option>
						<option value="Mali">Mali</option>
						<option value="Malta">Malta</option>
						<option value="Marshall Islands">Marshall Islands</option>
						<option value="Martinique">Martinique</option>
						<option value="Mauritania">Mauritania</option>
						<option value="Mauritius">Mauritius</option>
						<option value="Mexico">Mexico</option>
						<option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
						<option value="Moldova, Republic of">Moldova, Republic of</option>
						<option value="Monaco">Monaco</option>
						<option value="Mongolia">Mongolia</option>
						<option value="Montenegro">Montenegro</option>
						<option value="Montserrat">Montserrat</option>
						<option value="Morocco">Morocco</option>
						<option value="Mozambique">Mozambique</option>
						<option value="Myanmar">Myanmar</option>
						<option value="Namibia">Namibia</option>
						<option value="Nauru">Nauru</option>
						<option value="Nepal">Nepal</option>
						<option value="New Caledonia">New Caledonia</option>
						<option value="New Zealand">New Zealand</option>
						<option value="Nicaragua">Nicaragua</option>
						<option value="Nigeria">Nigeria</option>
						<option value="Niue">Niue</option>
						<option value="Northern Mariana Islands">Northern Mariana Islands</option>
						<option value="Norway">Norway</option>
						<option value="Oman">Oman</option>
						<option value="Pakistan">Pakistan</option>
						<option value="Palau">Palau</option>
						<option value="Palestine, State of">Palestine, State of</option>
						<option value="Panama">Panama</option>
						<option value="Papua New Guinea">Papua New Guinea</option>
						<option value="Paraguay">Paraguay</option>
						<option value="Peru">Peru</option>
						<option value="Philippines">Philippines</option>
						<option value="Poland">Poland</option>
						<option value="Portugal">Portugal</option>
						<option value="Puerto Rico">Puerto Rico</option>
						<option value="Qatar">Qatar</option>
						<option value="Réunion">Réunion</option>
						<option value="Romania">Romania</option>
						<option value="Russian Federation">Russian Federation</option>
						<option value="Rwanda">Rwanda</option>
						<option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
						<option value="Saint Lucia">Saint Lucia</option>
						<option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
						<option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
						<option value="Samoa">Samoa</option>
						<option value="San Marino">San Marino</option>
						<option value="Sao Tome and Principe">Sao Tome and Principe</option>
						<option value="Saudi Arabia">Saudi Arabia</option>
						<option value="Senegal">Senegal</option>
						<option value="Seychelles">Seychelles</option>
						<option value="Sierra Leone">Sierra Leone</option>
						<option value="Singapore">Singapore</option>
						<option value="Sint Maarten (Dutch part)">Sint Maarten (Dutch part)</option>
						<option value="Slovakia">Slovakia</option>
						<option value="Slovenia">Slovenia</option>
						<option value="Solomon Islands">Solomon Islands</option>
						<option value="Somalia">Somalia</option>
						<option value="South Africa">South Africa</option>
						<option value="South Sudan">South Sudan</option>
						<option value="Spain">Spain</option>
						<option value="Sri Lanka">Sri Lanka</option>
						<option value="Saint Helena, Ascension and Tristan da Cunha">Saint Helena, Ascension and Tristan da Cunha</option>
						<option value="Saint Martin (French part)">Saint Martin (French part)</option>
						<option value="Sudan">Sudan</option>
						<option value="Suriname">Suriname</option>
						<option value="Sweden">Sweden</option>
						<option value="Switzerland">Switzerland</option>
						<option value="Syrian Arab Republic">Syrian Arab Republic</option>
						<option value="Taiwan, Province of China">Taiwan, Province of China</option>
						<option value="Tajikistan">Tajikistan</option>
						<option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
						<option value="Thailand">Thailand</option>
						<option value="Timor-Leste">Timor-Leste</option>
						<option value="Togo">Togo</option>
						<option value="Tonga">Tonga</option>
						<option value="Trinidad and Tobago">Trinidad and Tobago</option>
						<option value="Tunisia">Tunisia</option>
						<option value="Turkey">Turkey</option>
						<option value="Turkmenistan">Turkmenistan</option>
						<option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
						<option value="Tuvalu">Tuvalu</option>
						<option value="Uganda">Uganda</option>
						<option value="Ukraine">Ukraine</option>
						<option value="United Arab Emirates">United Arab Emirates</option>
						<option value="United Kingdom">United Kingdom</option>
						<option value="United States">United States</option>
						<option value="Uruguay">Uruguay</option>
						<option value="Uzbekistan">Uzbekistan</option>
						<option value="Vanuatu">Vanuatu</option>
						<option value="Venezuela, Bolivarian Republic of">Venezuela, Bolivarian Republic of</option>
						<option value="Viet Nam">Viet Nam</option>
						<option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
						<option value="Wallis and Futuna">Wallis and Futuna</option>
						<option value="Western Sahara">Western Sahara</option>
						<option value="Yemen">Yemen</option>
						<option value="Zambia">Zambia</option>
						<option value="Zimbabwe">Zimbabwe</option>
					</select>				
				</li>

				<li>{/* City Text Entry*/}
					<label name="city" className="city">What city?</label>
					<input required = "Required" name="city" type="text" placeholder="Enter city name" value={this.state.city} onChange={this.accountChangeHandler}/>
				</li>

				<li>{/* Donation Item Text Entry */}
					<label name="donationItem" className="donationItem">What did you donate?</label>
					<input required = "Required" name="donationItem" className="donationItem" type="text" placeholder="Enter Donation Item" value={this.state.donationItem} onChange={this.accountChangeHandler}/>
				</li>
				
				<li>{/* Donation Item Category Selection List */}
					<label name="donationCategory" className="donationCategory"></label>
					<select className="select-css" required = "Required" name='donationCategory' value={this.state.donationCategory} onChange={this.accountChangeHandler}>
					  <option value="selected">Select the Donation Category</option>
					  <option value="Animal Welfare">Animal Welfare</option>
					  <option value="Art">Art</option>
					  <option value="Clothing">Clothing</option>
					  <option value="Education">Education</option>
					  <option value="Environment">Environment</option>
					  <option value="Food">Food</option>
					  <option value="Health">Health</option>
					  <option value="Household">Household</option>
					  <option value="Miscellaneous">Miscellaneous</option>
					  <option value="Sports">Sports</option>
					</select>
				</li>
				
				<li>{/* Individual or Organization Drop Down */}	
					<label name="donationRecipient" className="donationRecipient"></label>				
					<select className="select-css" name="donationRecipient" value={this.state.donationRecipient} onChange={this.accountChangeHandler}>
						<option value="selected">Individual or Organization?</option>
						<option value="individual">Donation to an Individual</option>
						<option value="organization">Donation to an Organization</option>
					</select>
						
				</li>

				<li>{/* Donation Usefulness Rating DropDown */}
					<label name="rating" className="rating">How useful was this donation? 5 = Very Useful</label>
					<select className="select-css" required = "Required" name='rating' value={this.state.rating} onChange={this.accountChangeHandler}>
					  <option value="selected">Score out of 5</option>
					  <option value="1">1</option>
					  <option value="2">2</option>
					  <option value="3">3</option>
					  <option value="4">4</option>
					  <option value="5">5</option>					  
					</select>

				</li>
				{/* To-Do: Add Another Item functionality*/}
				{/* <li>
					<button>Add Item</button>
				</li> */}

				<li>{/* Suggested Future Donation Item Name Text Entry */}
					<label name="suggestedDonationItem" className="suggestedDonationItem">Suggest Future Donation Item?</label>
					<input required = "Required"  name="suggestedDonationItem" className="suggestedDonationItem" type="text" placeholder="Enter Donation Item or type 'None'"value={this.state.suggestedDonationItem} onChange={this.accountChangeHandler} />
				</li>
				
				<li>{/* Suggested Future Donation Item Category Selection List */}
					<label name="donationCategorySuggested" className="donationCategorySuggested"></label>
					<select required = "Required" className="select-css" name='donationCategorySuggested' value={this.state.donationCategorySuggested} onChange={this.accountChangeHandler}>
					  <option value="selected">Select the Donation Category</option>
					  <option value="NA">Not Applicable</option>
					  <option value="Animal Welfare">Animal Welfare</option>
					  <option value="Art">Art</option>
					  <option value="Clothing">Clothing</option>
					  <option value="Education">Education</option>
					  <option value="Environment">Environment</option>
					  <option value="Food">Food</option>
					  <option value="Health">Health</option>
					  <option value="Household">Household</option>
					  <option value="Miscellaneous">Miscellaneous</option>
					  <option value="Sports">Sports</option>
					</select>
				</li>
				
				<li>{/* Suggested Future Donation Item Readon Text Entry */}
				<label name="itemDescription" className="itemDescription"></label>
				<input required = "Required"  name="itemDescription" className="itemDescription" type="text" placeholder="Enter Reason for Suggestion or 'None'" value={this.state.itemDescription} onChange={this.accountChangeHandler}/>
				</li>
				
				<li>{/* Trip Descritption Text Entry */}
					<label name="description" className="description" >What else would you like to share?</label>
					<textarea  className="text-area-css" required = "Required" name='description' placeholder="Type your story here." onChange={this.accountChangeHandler}/>
				</li>

				{/* <li> Make Private  Checkbox - feature currently not supported: checkbox not sending bool to console
					<label>Make Private?</label>
						<ul className="flex-inner">						
						<label>Private
						<input name="isPrivate" type="checkbox"  checked={this.state.isPrivate} onChange={this.accountChangeHandler} />
						</label>	
            </ul>
				<li>
				{/* Image Upload not currently supported. Uncomment this code to show button and add functionality
				<li>
					<label name="pictures" className="pictures">Upload Pictures?</label>
					<input type='file' size="100"/>
				</li>
				*/}
				<li> {/* Submit Button */}
					<button type="submit">Submit</button>
				</li>
			</ul>
		</form>
		);
	}
}


/* The card that displays a user's trip information by date in descending order */
class Post extends React.Component {
	constructor(props) {
		super(props)
    var tripInfo = this.props.tripInfo;
	var tripDate = new Date(tripInfo.tripDate);
	
    this.state = {
		city: tripInfo.locationID.city,
		country: tripInfo.locationID.country,
		tripDate: (tripDate.getMonth() + 1) + "/" +  tripDate.getDate() + "/" +  tripDate.getFullYear(),
		notes: tripInfo.notes, 
		donationItem: ( tripInfo.donations && tripInfo.donations.length > 1) ? tripInfo.donations[1].itemName : "None",
		donationRating: ( tripInfo.donations && tripInfo.donations.length > 1) ? tripInfo.donations[1].rating : "None",
		suggestedDonationItem: tripInfo.donations ? tripInfo.donations[0].itemName : "None",
		itemDescription: tripInfo.donations ? tripInfo.donations[0].itemDescription : "None",
		userID: tripInfo.userID	 
    	}
	}
	
	render() {
		var star_number;
		var rating_number = this.state.donationRating;
		if (rating_number === 1) 
		{
			star_number = <div><FontAwesomeIcon icon={faStar} color='yellow' /></div>
		}
		else if (rating_number === 2)
		{
			star_number = <div><FontAwesomeIcon icon={faStar} color='yellow' /><FontAwesomeIcon icon={faStar} color='yellow' /></div>
		}
		else if (rating_number === 3)
		{
			star_number = <div><FontAwesomeIcon icon={faStar} color='yellow' /><FontAwesomeIcon icon={faStar} color='yellow' /><FontAwesomeIcon icon={faStar} color='yellow' /></div>
		}
		else if (rating_number === 4)
		{
			star_number = <div><FontAwesomeIcon icon={faStar} color='yellow' /><FontAwesomeIcon icon={faStar} color='yellow' /><FontAwesomeIcon icon={faStar} color='yellow' /><FontAwesomeIcon icon={faStar} color='yellow' /></div>
		}
		else if (rating_number === 5)
		{
			star_number = <div><FontAwesomeIcon icon={faStar} color='yellow' /><FontAwesomeIcon icon={faStar} color='yellow' /><FontAwesomeIcon icon={faStar} color='yellow' /><FontAwesomeIcon icon={faStar} color='yellow' /><FontAwesomeIcon icon={faStar} color='yellow' /></div>
		}
	return (
		
			<div className="Post">
				<div className="post-top-row">
					<div className="post-destination-column">
						<div className="Post-destination">{this.state.city}, {this.state.country}</div>
					</div>
					<div className="post-date-column">
						<div className="Post-date"> {this.state.tripDate}</div>
					</div>
				</div>
				<div className="post-middle-row">
					<div className="Post-image">
						<img src={ ComingSoonIcon } alt="One person helping another" width='400px'/>
					</div>
				</div>
				<br></br>
				<div className="post-description-row"> {this.state.notes} </div>
				<br></br>
				<div className="Post-donation-row"> Items Donated:  {this.state.donationItem}</div>
				<br></br>
				<div className="Post-stars"> Donation rating: {star_number}	</div>
				<br></br>
				<div className="Post-donation-row"> Suggested Donations:  {this.state.suggestedDonationItem}</div>
				<br></br>
				<div className="Post-donation-row"> Suggested Donation Reason:  {this.state.itemDescription}</div>
				<br></br>
			</div>
		
  		);
	}
}


/* This component loads Trip Info from the database for Posts on an Account Page */
class AccountContainer extends React.Component {
	constructor(props) {
		super(props)
    this.state = { loading: 'true', reloadAccount: this.reload };
	}
  reload = () => {
    console.log('READLOAD');
    this.setState({ loading: 'true', reloadAccount: this.reload });
    this.getTrips(this)
      .then(res => {
        this.setState({
          trips: res,
          loading: 'false',
          reloadAccount: this.reload
        });
      });
  }
  getTrips = async () => {
    const response = await fetch('/api/user/trip/user-trips');
    const data = await response.json();
    if (response.status !== 200) {
      throw Error(response.message)
	}
	console.log(data);
    return data;
  }; 
	componentDidMount() {
    this.getTrips(this)
      .then(res => {
        this.setState({
          trips: res,
          loading: 'false',
          reloadAccount: this.reload
        });
      })
      .catch(err => console.log(err)); // TODO: handle all errors and relay to user
	}
	render() {
    if(this.state.loading === 'false'){
		  return <Account post={this.state} />
    }
		return <Account post={this.state} />
	}
}

/* This function handles the formatting and rendering of the entire Account Page */
function Account(props) {
	var trips = <div></div>
	if(props.post.loading === "false"){
	  var tripData = props.post.trips.trips;
	  trips = tripData.map(trip => {
		return (<Post tripInfo={trip}/> )
				
	  });
	  trips = <div className="account-row">{trips.reverse()} </div>
	}
	
	return (
	  <div className="Account">
		  <div className='account-row'>
			  <div className='account-column'>
				  <div className='user-info-container'>
					  <User/> 
				  </div>
				  					  
				  <h1 style={{paddingLeft: '5%'}}>Your Travel Map</h1>
				  <div className='account-map' >
					<img src={ WorldMapImage } alt="map of the world" width='100%' />
				  </div>			  
			  </div>
			  <div className='account-column'>
					<div className='container'>
					  <h3 style={{fontSize: 18, textAlign: "center", lineHeight: 5}}>
						  Share your recent DoMAD travel story!
					  </h3>
					  <UserTripForm reloadAccount={props.post.reloadAccount} />
					</div>
			  </div>
		  </div>
		  <h1 > Your Trips </h1>
		    {trips}	
	  </div>
	  );
  }

export default AccountContainer;