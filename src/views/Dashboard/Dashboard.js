import React, { Component } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { withStyles } from '@material-ui/core';
import AccessTime from "@material-ui/icons/AccessTime";
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import TimelineIcon from '@material-ui/icons/Timeline';
import OpacityIcon from '@material-ui/icons/Opacity';
import AcUnitIcon from '@material-ui/icons/AcUnit';
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { dailySalesChart, emailsSubscriptionChart } from "variables/charts.js";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import LocationOnIcon from '@material-ui/icons/LocationOn';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import NatureIcon from '@material-ui/icons/Nature';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import * as Firebase from 'firebase'

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            humidity: 0,
            temp: 0,
            datetime: '',
            prevDateTime: '',
            updateTempTime: 0,
            updateHumiTime: 0,
            openAlert: false,
            CO2ppm: 0,
            AirQuality: 0,
            apiMinTemp: 0,
            apiMaxTemp: 0,
            apiDateTime: ''
        }
    }

    componentDidMount() {
        Firebase.auth().onAuthStateChanged(user => {
            if (user && localStorage.firstLogin === undefined) {
                console.log(user)
                this.setState({
                    openAlert: true
                }, () => {
                    localStorage.setItem("isLogin", true);
                    localStorage.setItem("firstLogin", true);
                })
            }
            else if (user) {
                localStorage.setItem("isLogin", true);
            }
            else if (localStorage.getItem("isLogout") === "true" || localStorage.getItem("isLogout") === null) {
                this.props.history.push("/");
            }
            else if (localStorage.firstLogin === undefined) {
                this.setState({
                    openAlert: true
                }, () => {
                    localStorage.setItem("isLogin", true);
                    localStorage.setItem("firstLogin", true);
                })
            }

        });
        const rootRef = Firebase.database().ref()
        const humidityValue = rootRef.child("Humidity")
        const tempValue = rootRef.child("Temp")
        const datetime = rootRef.child("DateTime")
        const AirQuality = rootRef.child("AirQuality")
        const CO2ppm = rootRef.child("CO2ppm")
        humidityValue.on("value", snap => {
            let deltaSecond = this.state.datetime.substr(17, 2) - this.state.prevDateTime.substr(17, 2)
            if (deltaSecond < 0 && deltaSecond > -58) {
                deltaSecond = 60 - this.state.prevDateTime.substr(17, 2)
            }
            if (emailsSubscriptionChart.data.labels.length >= 12) {
                emailsSubscriptionChart.data.labels.splice(0, 1)
                emailsSubscriptionChart.data.series[0].splice(0, 1)
            }
            emailsSubscriptionChart.data.labels.push(this.state.datetime)
            emailsSubscriptionChart.data.series[0].push(snap.val().slice(0, 5))
            this.setState({
                humidity: snap.val(),
                updateHumiTime: deltaSecond
            })
        })
        tempValue.on("value", snap => {
            let deltaSecond = this.state.datetime.substr(17, 2) - this.state.prevDateTime.substr(17, 2)
            if (deltaSecond < 0) {
                deltaSecond = 60 - this.state.prevDateTime.substr(17, 2)
            }
            if (dailySalesChart.data.labels.length >= 12) {
                dailySalesChart.data.labels.splice(0, 1)
                dailySalesChart.data.series[0].splice(0, 1)
            }
            dailySalesChart.data.labels.push(this.state.datetime)
            dailySalesChart.data.series[0].push(snap.val().slice(0, 5))
            this.setState({
                temp: snap.val(),
                updateTempTime: deltaSecond
            })
        })
        datetime.on("value", snap => {
            this.setState({
                prevDateTime: this.state.datetime,
                datetime: snap.val()
            })
        })
        AirQuality.on("value", snap => {
            this.setState({
                AirQuality: snap.val()
            })
        })
        CO2ppm.on("value", snap => {
            this.setState({
                CO2ppm: snap.val()
            })
        })

        fetch("http://dataservice.accuweather.com/forecasts/v1/daily/1day/353981?apikey=TAuyA2m9DeTqcQMcLiHtte5fNueGB38A")
            .then(res => res.json())
            .then(
                (result) => {
                    let data = result.DailyForecasts[0]
                    let dateTime = data.Date.substring(0, 10)
                    let day = dateTime.substring(8, 10);
                    let month = dateTime.substring(5, 7);
                    let year = dateTime.substring(0, 4);
                    let datetime = (day + "-" + month + "-" + year + " 00:00:00");
                    let maxTemp = Math.round((data.Temperature.Maximum.Value - 32) * 5 / 9);
                    let minTemp = Math.round((data.Temperature.Minimum.Value - 32) * 5 / 9);
                    this.setState({
                        apiMaxTemp: maxTemp,
                        apiMinTemp: minTemp,
                        apiDateTime: datetime
                    })
                })
    }

    render() {
        let { classes } = this.props
        let { humidity, temp, datetime, updateHumiTime, updateTempTime,
            CO2ppm, AirQuality, apiDateTime, apiMaxTemp, apiMinTemp } = this.state

        return (
            <div>
                <GridContainer>
                    <GridItem xs={12}>
                        <Snackbar
                            place="tc"
                            color="success"
                            message="Đăng nhập thành công!!!"
                            open={this.state.openAlert}
                            closeNotification={() => this.setState({ openAlert: false })}
                            close
                        />
                        <Card>
                            <CardHeader color="warning" >
                                <h4 className={classes.cardTitleWhite}
                                    style={{ fontWeight: "bold" }}>
                                    <DesktopWindowsIcon
                                        className={classes.monitorIcon} />
                                    THEO DÕI NHIỆT ĐỘ, ĐỘ ẨM THỜI GIAN THỰC
                                    <DesktopWindowsIcon className={classes.monitorIcon} />
                                </h4>
                            </CardHeader>
                            <CardBody style={{ fontSize: "17px" }}>
                                <GridContainer>
                                    <GridItem xs={12} sm={6}>
                                        <div>
                                            <LocationOnIcon /> Vị trí: thành phố Hồ Chí Minh
                                </div>
                                        <div>
                                            <AccessTime />
                                            &nbsp;
                                            Thời gian đo được:
                                            &nbsp;
                                    {datetime === 0 ? 'None' : datetime}
                                        </div>
                                        <div>
                                            <OpacityIcon />
                                            &nbsp;
                                            Độ ẩm:
                                            &nbsp;
                                    {humidity === 0 ? 'None' : humidity}
                                        </div>
                                        <div>
                                            <AcUnitIcon />
                                            &nbsp;
                                            Nhiệt độ:
                                            &nbsp;
                                    {temp === 0 ? 'None' : temp}
                                        </div>
                                        <div>
                                            <NatureIcon />
                                            &nbsp;
                                            Chất lượng không khí:
                                            &nbsp;
                                    {AirQuality === 0 ? 'None' : AirQuality}
                                        </div>
                                        <div>
                                            <WhatshotIcon />
                                            &nbsp;
                                            Nồng độ CO2 trong không khí:
                                            &nbsp;
                                    {CO2ppm === 0 ? 'None' : CO2ppm}
                                        </div>
                                    </GridItem>
                                    <GridItem xs={12} sm={6}>
                                        <div>
                                            <img src="https://downloads.accuweather.com/assets/images/logo_v2.png" 
                                            alt="icon"
                                            style={{width: "450px", height: "70px", marginBottom: "15px"}}/>
                                        </div>
                                        <div>
                                            <AccessTime />
                                            &nbsp;
                                            Thời gian đo được:
                                            &nbsp;
                                    {apiDateTime === 0 ? 'None' : apiDateTime}
                                        </div>
                                        <div>
                                            <ArrowDownwardIcon />
                                            &nbsp;
                                            Nhiệt độ thấp nhất:
                                            &nbsp;
                                    {apiMinTemp === 0 ? 'None' : apiMinTemp}
                                        </div>
                                        <div>
                                            <ArrowUpwardIcon />
                                            &nbsp;
                                            Nhiệt độ cao nhất:
                                            &nbsp;
                                    {apiMaxTemp === 0 ? 'None' : apiMaxTemp}
                                        </div>
                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite} style={{ fontWeight: "bold" }}>
                                    <TimelineIcon />
                                    &nbsp;
                                    BIỂU ĐỒ THAY ĐỔI NHIỆT ĐỘ, ĐỘ ẨM
                                    &nbsp;
                                    <TimelineIcon />
                                </h4>
                            </CardHeader>
                            <CardBody>
                                <GridItem sm={12}>
                                    <Card chart>
                                        <div style={{ margin: "10px" }}></div>
                                        <CardHeader color="success">
                                            <ChartistGraph
                                                className="ct-chart"
                                                data={dailySalesChart.data}
                                                type="Line"
                                                options={dailySalesChart.options}
                                                listener={dailySalesChart.animation}
                                            />
                                        </CardHeader>
                                        <CardBody style={{ textAlign: "center" }}>
                                            <h4 className={classes.cardTitle}>
                                                Biểu đồ nhiệt độ thời gian thực</h4>
                                            <div className={classes.stats}>
                                                <AccessTime /> updated {updateTempTime === 0 ? '...' : updateTempTime} seconds ago
                                            </div>
                                        </CardBody>
                                    </Card>
                                </GridItem>
                                <GridItem sm={12}>
                                    <Card chart>
                                        <div style={{ margin: "20px" }}></div>
                                        <CardHeader color="info">
                                            <ChartistGraph
                                                className="ct-chart"
                                                data={emailsSubscriptionChart.data}
                                                type="Line"
                                                options={emailsSubscriptionChart.options}
                                                listener={emailsSubscriptionChart.animation}
                                            />
                                        </CardHeader>
                                        <CardBody style={{ textAlign: "center" }}>
                                            <h4 className={classes.cardTitle}>
                                                Biểu đồ độ ẩm thời gian thực</h4>
                                            <p className={classes.cardCategory}>
                                            </p>
                                            <div className={classes.stats}>
                                                <AccessTime /> updated {updateHumiTime === 0 ? '...' : updateHumiTime} seconds ago
                                            </div>
                                        </CardBody>
                                    </Card>
                                </GridItem>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div >
        );
    }
}

export default withStyles(dashboardStyle)(Dashboard)
