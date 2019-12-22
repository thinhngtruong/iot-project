import React from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import EmailIcon from '@material-ui/icons/Email';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import * as Firebase from 'firebase'

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  txtStyle: {
    fontSize: "16px",
    margin: "10px"
  }
};


class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      emailVerify: null,
      displayName: null,
      phoneNumber: null,
      ID: null
    }
  }

  componentDidMount() {
    Firebase.auth().onAuthStateChanged(user => {
      console.log(user)
      if (user === null) {
        this.setState({
          email: "admin@gmail.com",
          displayName: "Nhóm 2",
          phoneNumber: "0123456789",
          ID: "1",
          emailVerify: true
        })
      }
      else {
        this.setState({
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.providerData[0].phoneNumber,
          ID: user.providerData[0].uid,
          emailVerify: user.emailVerified
        })
      }
    })
  }

  handleLogout = () => {
    Firebase.auth().signOut();
    localStorage.setItem("isLogin", false);
    localStorage.setItem("isLogout", true);
    localStorage.removeItem("firstLogin");
    this.props.history.push('/');
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="success">
                <h4 className={classes.cardTitleWhite} style={{ textAlign: "center", fontWeight: "bold" }}>THÔNG TIN TÀI KHOẢN</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <div className={classes.txtStyle}>
                      <PermIdentityIcon />
                      &nbsp;
                      UID: {this.state.ID}
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <div className={classes.txtStyle}>
                      <PhoneAndroidIcon />
                      &nbsp;
                      Số điện thoại: {this.state.phoneNumber === null ? "Chưa có" : this.state.phoneNumber}
                    </div>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <div className={classes.txtStyle}>
                      <EmailIcon />
                      &nbsp;
                      Email: {this.state.email}
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <div className={classes.txtStyle}>
                      <VerifiedUserIcon />
                      &nbsp;
                      Email Verified: {this.state.emailVerify === false ? "Chưa xác nhận" : "Đã xác nhận"}
                    </div>
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="danger" style={{ marginLeft: "325px" }} onClick={() => this.handleLogout()}>
                  <ExitToAppIcon />
                  &nbsp;
                    Đăng xuất
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardAvatar profile>
                <a href={`https://facebook.com/profile.php?id=${this.state.ID}`}>
                  <img src="https://scontent.fsgn5-7.fna.fbcdn.net/v/t1.0-9/p960x960/78278904_1370212863155229_156963002921254912_o.jpg?_nc_cat=103&_nc_ohc=7ZamqBMkaBEAQmTZCzPS-DbvOQzsUb2rS0I6N5ap8vCCIKoqy3OzBksmg&_nc_ht=scontent.fsgn5-7.fna&oh=13fa49978c91bf68f96cc380fafb7d23&oe=5E725F20"
                    alt="..." />
                </a>
              </CardAvatar>
              <CardBody profile>
                <h3>ADMIN</h3>
                <h4 className={classes.cardTitle}>{this.state.displayName}</h4>
                <p className={classes.txtStyle} style={{ color: "#a8a1a1", fontSize: "16px", fontStyle: "italic" }}>
                  "And while some may see them as the crazy ones, we see genius.
                  Because the people who are crazy enough to think they can change the world,
                  are the ones who do.” - Steve Jobs
                </p>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(UserProfile)
