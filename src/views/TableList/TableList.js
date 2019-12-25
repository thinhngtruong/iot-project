import React from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core";
import ChartistGraph from "react-chartist";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import EqualizerIcon from '@material-ui/icons/Equalizer';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Table from "components/Table/Table.js";
import {
    completedTasksChart,
    weekPerMonth
} from "variables/charts.js";
import { grayColor } from "assets/jss/material-dashboard-react.js";
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import * as Firebase from 'firebase'
import CardFooter from "components/Card/CardFooter";

const styles = {
    cardCategoryWhite: {
        "&,& a,& a:hover,& a:focus": {
            color: "rgba(255,255,255,.62)",
            margin: "0",
            fontSize: "14px",
            marginTop: "0",
            marginBottom: "0"
        },
        "& a,& a:hover,& a:focus": {
            color: "#FFFFFF"
        }
    },
    cardTitleWhite: {
        color: "white",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
            color: grayColor[1],
            fontWeight: "400",
            lineHeight: "1"
        },
        textAlign: "center"
    },
    stats: {
        color: grayColor[0],
        display: "inline-flex",
        fontSize: "12px",
        lineHeight: "22px",
        "& svg": {
            top: "4px",
            width: "16px",
            height: "16px",
            position: "relative",
            marginRight: "3px",
            marginLeft: "3px"
        },
        "& .fab,& .fas,& .far,& .fal,& .material-icons": {
            top: "4px",
            fontSize: "16px",
            position: "relative",
            marginRight: "3px",
            marginLeft: "3px"
        }
    },
    cardTitle: {
        color: grayColor[2],
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
            color: grayColor[1],
            fontWeight: "400",
            lineHeight: "1"
        }
    }
};


class TableList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            monthTemp: [],
        }
    }

    componentDidMount() {
        let { monthTemp } = this.state
        const db = Firebase.firestore();
        let totalHumiPerWeek = [0, 0, 0, 0];
        let totalTempPerWeek = [0, 0, 0, 0];
        let avgHumiPerWeek = [0, 0, 0, 0];
        let avgTempPerWeek = [0, 0, 0, 0];
        let i = 0;
        let objMonth = {};
        let arrTemp = [];
        let arrHumi = [];
        if (completedTasksChart.data.labels.length === 0) {
            db.collection('Temp').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    objMonth = { ...objMonth, month: doc.id }
                    monthTemp.push(objMonth)
                    for (var key in doc.data()) {
                        let value = doc.data()[key];
                        arrTemp.push(value);
                        if (doc.id === "11-2019") {
                            completedTasksChart.data.labels.push("Ngày " + key);
                            completedTasksChart.data.series[0].push(value);
                        }
                    }
                    localStorage.setItem("tempPerDay", JSON.stringify(arrTemp))
                    this.setState({
                        monthTemp: monthTemp,
                    })
                });
            })
            db.collection('Humi').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    for (var key in doc.data()) {
                        let value = doc.data()[key];
                        arrHumi.push(value);
                        if (doc.id === "11-2019") {
                            completedTasksChart.data.series[1].push(value);
                        }
                    }
                    localStorage.setItem("humiPerDay", JSON.stringify(arrHumi))
                    this.setState({
                        monthTemp: monthTemp,
                    })
                });
            })

            let tempPerDay = JSON.parse(localStorage.getItem("tempPerDay"));
            let humiPerDay = JSON.parse(localStorage.getItem("humiPerDay"));
            if (tempPerDay !== null) {
                for (let index = 0; index < 31; index++) {
                    if (Math.floor(index / 7) === i && index < 28) {
                        totalHumiPerWeek[i] += humiPerDay[index];
                        totalTempPerWeek[i] += tempPerDay[index];
                        i++;
                    }
                    else {
                        totalHumiPerWeek[i - 1] += humiPerDay[index];
                        totalTempPerWeek[i - 1] += tempPerDay[index];
                    }
                }
                let sum = 0;
                let avg = 0;
                for (let index = 0; index < tempPerDay.length; index++) {
                    if (index < 30) {
                        sum += tempPerDay[index];
                    }
                    if (index === 30) {
                        avg = sum / 31;
                        localStorage.setItem("avgTempMonth10", Math.round(avg));
                        avg = 0;
                        sum = 0;
                    }
                    if (index > 30 && index <= 60) {
                        sum += tempPerDay[index];
                    }
                    if (index === 61) {
                        avg = sum / 30;
                        localStorage.setItem("avgTempMonth11", Math.round(avg));
                        avg = 0;
                        sum = 0;
                    }
                    if (index > 60 && index <= 90) {
                        sum += tempPerDay[index];
                    }
                    if (index === 91) {
                        avg = sum / 31;
                        localStorage.setItem("avgTempMonth12", Math.round(avg));
                        avg = 0;
                        sum = 0;
                    }
                }
            }
            if (humiPerDay !== null) {
                for (let index = 0; index < totalHumiPerWeek.length; index++) {
                    if (index < 3) {
                        avgHumiPerWeek[index] = Math.round(totalHumiPerWeek[index] / 7);
                        avgTempPerWeek[index] = Math.round(totalTempPerWeek[index] / 7);
                    }
                    else {
                        avgHumiPerWeek[index] = Math.round(totalHumiPerWeek[index] / 10);
                        avgTempPerWeek[index] = Math.round(totalTempPerWeek[index] / 10);
                    }
                    weekPerMonth.data.labels.push("Tuần " + (index + 1));
                }
                weekPerMonth.data.series[0] = avgTempPerWeek;
                weekPerMonth.data.series[1] = avgHumiPerWeek;
                let sum = 0;
                let avg = 0;
                for (let index = 0; index < humiPerDay.length; index++) {
                    if (index < 30) {
                        sum += humiPerDay[index];
                    }
                    if (index === 30) {
                        avg = sum / 31;
                        localStorage.setItem("avgHumiMonth10", Math.round(avg));
                        avg = 0;
                        sum = 0;
                    }
                    if (index > 30 && index <= 60) {
                        sum += humiPerDay[index];
                    }
                    if (index === 61) {
                        avg = sum / 30;
                        localStorage.setItem("avgHumiMonth11", Math.round(avg));
                        avg = 0;
                        sum = 0;
                    }
                    if (index > 60 && index <= 90) {
                        sum += humiPerDay[index];
                    }
                    if (index === 91) {
                        avg = sum / 31;
                        localStorage.setItem("avgHumiMonth12", Math.round(avg));
                        avg = 0;
                        sum = 0;
                    }
                }
            }
        }
    }

    render() {
        const { classes } = this.props
        const { monthTemp } = this.state;
        let monthName = ""
        if (monthTemp[1] !== undefined) {
            monthName = monthTemp[1].month
        }
        let temp10 = { month: 10, value: localStorage.getItem("avgTempMonth10") };
        let temp11 = { month: 11, value: localStorage.getItem("avgTempMonth11") };
        let temp12 = { month: 12, value: localStorage.getItem("avgTempMonth12") };
        let arrTemp = [temp10, temp11, temp12];
        let tempSort = arrTemp.sort((a, b) => b.value - a.value);
        let tableData1 = [];
        tempSort.forEach(data => {
            let temp = ["Tháng " + data.month, data.value + "°C"];
            tableData1.push(temp);
        })
        let humi10 = { month: 10, value: localStorage.getItem("avgHumiMonth10") };
        let humi11 = { month: 11, value: localStorage.getItem("avgHumiMonth11") };
        let humi12 = { month: 12, value: localStorage.getItem("avgHumiMonth12") };
        let arrHumi = [humi10, humi11, humi12];
        let HumiTemp = arrHumi.sort((a, b) => b.value - a.value);
        let tableData2 = [];
        HumiTemp.forEach(data => {
            let humi = ["Tháng " + data.month, data.value + "%"];
            tableData2.push(humi);
        })
        return (
            <div>
                <GridContainer>
                    <GridItem xs={12}>
                        <Card>
                            <CardHeader color="success">
                                <h4 className={classes.cardTitleWhite} style={{ textAlign: "center", fontWeight: "bold" }}>
                                    <FormatListNumberedIcon />
                                    &nbsp;
                                    TOP CÁC THÁNG CÓ NHIỆT ĐỘ - ĐỘ ẨM CAO NHẤT
                                    &nbsp;
                                    <FormatListNumberedIcon />
                                </h4>
                            </CardHeader>
                            <CardBody>
                                <GridContainer justify="space-between">
                                    <GridItem xs={12} sm={6}>
                                        <div style={{
                                            textAlign: "center", fontSize: "18px", fontWeight: "bold",
                                            color: "cornflowerblue"
                                        }}>
                                            Top các tháng có nhiệt độ trung bình cao nhất</div>
                                        <Table
                                            hover
                                            tableHead={["Tháng", "Nhiệt độ"]}
                                            tableData={tableData1}
                                            coloredColls={[3]}
                                            colorsColls={["primary"]}>
                                        </Table>
                                    </GridItem>
                                    <GridItem xs={12} sm={6}>
                                        <div style={{
                                            textAlign: "center", fontSize: "18px", fontWeight: "bold",
                                            color: "cornflowerblue"
                                        }}>Top các tháng có độ ẩm trung bình cao nhất</div>
                                        <Table
                                            hover
                                            tableHead={["Tháng", "Độ ẩm"]}
                                            tableData={tableData2}
                                            coloredColls={[3]}
                                            colorsColls={["primary"]}
                                        />
                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                            <CardFooter />
                        </Card>
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite} style={{ textAlign: "center", fontWeight: "bold" }}>
                                    <EqualizerIcon />
                                    &nbsp;
                                    BIỂU ĐỒ THỐNG KÊ NHIỆT ĐỘ VÀ ĐỘ ẨM
                                    &nbsp;
                            <EqualizerIcon />
                                </h4>
                            </CardHeader>
                            <div style={{ margin: "10px" }}></div>
                            <CardBody>
                                <GridItem sm={12}>
                                    <Card chart>
                                        <CardHeader color="success">
                                            <ChartistGraph
                                                className="ct-chart"
                                                data={completedTasksChart.data}
                                                type="Line"
                                                options={completedTasksChart.options}
                                                listener={completedTasksChart.animation}
                                            />
                                        </CardHeader>
                                        <CardBody style={{ textAlign: "center" }}>
                                            <h4 className={classes.cardTitle}>Thống kê nhiệt độ theo ngày của Tháng {monthName}</h4>
                                        </CardBody>

                                    </Card>
                                </GridItem>
                                <GridItem sm={12}>
                                    <Card chart>
                                        <div style={{ margin: "20px" }}></div>
                                        <CardHeader color="warning">
                                            <ChartistGraph
                                                className="ct-chart"
                                                data={weekPerMonth.data}
                                                type="Bar"
                                                options={weekPerMonth.options}
                                                responsiveOptions={weekPerMonth.responsiveOptions}
                                                listener={weekPerMonth.animation}
                                            />
                                        </CardHeader>
                                        <CardBody style={{ textAlign: "center" }}>
                                            <h4 className={classes.cardTitle}>Thống kê nhiệt độ trung bình tuần của Tháng {monthName}</h4>
                                        </CardBody>
                                    </Card>
                                </GridItem>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer >
            </div>
        );
    }
}
export default withStyles(styles)(TableList)