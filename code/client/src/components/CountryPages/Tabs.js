import React from 'react';
import './Tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CountryInfoComponent from '../CountryPages/CountryInfo';
import DonationItemsComponent from '../CountryPages/DonationItems';
import OrganizationsComponent from '../CountryPages/Organizations';
import BlogPostsComponent from '../CountryPages/BlogPosts';
// Batch import all flag files

const flags = require.context('./flags', false);
//const flagPath = (name) => flags(name, true);


class CountryTabs extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            active: false, 
            active_name: '',
            active_abbr: 'USA',
            loading_info: false, loading_donations: false,
            loading_orgs: false, loading_blogs: false
        };

        this.receiveCountry = this.receiveCountry.bind(this);
        this.handleDataLoading = this.handleDataLoading.bind(this);
    }

    // Invoked from parent passing down selected country name
    // Passes country to the loader handler
    receiveCountry(country) {
        this.setState({
            active_name: (country.substring(0,1).toUpperCase() + country.substring(1)),
            active: true,
        });
        this.handleDataLoading(country);
    }

    // First invokes callback of CountryInfo, then sends and receives
    // db calls to DonationItems, Organizations, and Blog
    handleDataLoading = (country) => {

        // First attempt loading country info
        this.setState({ loading_info: true});
        console.log('Loading country info...');

        // getInfo 'res' is a tuple: [success, (success ? abbr: null)]
        this.refs.CountryInfo.getInfo(country)
            .then(res => {
                console.log(res[0], res[1]);
                if (res[0] == true) {
                    console.log("country info load success!");
                    //document.getElementById('country-flag').src = res[1] + '.png';
                    //this.flag_path = 'flags/' + res[1] + '.png';
                    
                    this.setState({ active_abbr: res[1], loading_info: false,
                        loading_donations: true, 
                        loading_orgs: true, 
                        loading_blogs: true
                    });
                    // load rest of data
                } else {
                    console.log('bad');
                }
            });   
    }

    //<img src={`${require(flag_path)}`} alt="No Flag" id="country-flag"/>
    render() {
        let defaultStyles = {
            display: (this.state.active ? 'flex' : 'none'),
            marginright: '1%',
            marginleft: '1%',
            transition: "visibility 0s, opacity 0.5s linear",
            transitionDuration: "0.2s", transitionDelay: "0"
        }
        console.log('abbr:', this.state.active_abbr);
        //let flag_path = 'flags/' + this.state.active_abbr + '.png';
        let flag_path = './flags/USA.png';
        return (
        <div id='country-pages-wrapper'>
            <div id="tabs-wrapper" style={defaultStyles}>
                <Tabs>
                    <TabList className="tab-style">
                        <li className="country-flag-block">
                            <img src='/flags/USA.png' alt="No Flag" id="country-flag"/>
                        </li>
                        <li className="country-name-block">
                            <h3>{this.state.current_country}</h3>
                        </li>
                        <Tab active className="regular-tabs">Country Info</Tab>
                        <Tab className="regular-tabs">Donation Items</Tab>
                        <Tab className="regular-tabs">Organizations</Tab>
                        <Tab className="regular-tabs">Blog Posts</Tab>
                    </TabList>

                    <TabPanel tabIndex={0}>
                        <CountryInfoComponent ref="CountryInfo"/>
                    </TabPanel>
                    <TabPanel tabIndex={1}>
                        <DonationItemsComponent ref="DonationItems"/>
                    </TabPanel>
                    <TabPanel tabIndex={2}>
                        <OrganizationsComponent ref="Organizations"/>
                    </TabPanel>
                    <TabPanel tabIndex={3}>
                        <BlogPostsComponent ref="BlogPosts"/>
                    </TabPanel>
            </Tabs>
            </div>
        </div>
        )
    }
}

export default CountryTabs;