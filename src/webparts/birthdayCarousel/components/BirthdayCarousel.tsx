import * as React from "react";
import type { IBirthdayCarouselProps } from "./IBirthdayCarouselProps";
import { Card, Carousel } from "antd";
import "antd/dist/reset.css";
import { useEffect, useState } from "react";
import styles from "./BirthdayCarousel.module.scss";

const BirthdayCarousel = (props: IBirthdayCarouselProps) => {
  const [birthdayUsers, setBirthdayUsers] = useState([]);

  var customStyles = `
  
    :where(.css-1rqnfsa).ant-carousel .slick-slider .slick-list {
    box-shadow: 1px 3px 11px 2px #85858578 !important;
     }

     :where(.css-1rqnfsa).ant-carousel .slick-dots {
      position: relative !important;
      top: 20px !important;
    }

    :where(.css-1rqnfsa).ant-carousel .slick-dots li {
      box-shadow: 1px 1px 4px 0px #6e6e6e !important;
    }

    // :where(.css-1rqnfsa).ant-carousel .slick-dots li.slick-active {
    //   border: 1px #ea881a;
    //   box-shadow: 1px 1px 4px 0px #ea881a;
    // }

    :where(.css-1rqnfsa).ant-carousel .slick-dots li.slick-active button {
     background-color: #ea881a !important; 
     height: 5px !important;
    }
  
  `;

  useEffect(() => {
    async function getBirthday() {
      try {
        const client = await props.context.msGraphClientFactory.getClient("3");
        const users = await client
          .api("/users")
          .select("id,displayName,employeeHireDate,jobTitle,userPrincipalName")
          .get();

        const today = new Date();
        const filteredUsers = users.value.filter((user: any) => {
          const hireDate = new Date(user.employeeHireDate);
          return (
            hireDate.getMonth() === today.getMonth() &&
            hireDate.getDate() === today.getDate()
          );
        });
        console.log(users);

        setBirthdayUsers(filteredUsers);
      } catch (error) {
        console.log(error);
      }
    }

    getBirthday();
  }, [props.context.msGraphClientFactory]);

  return (
    <>
      <style>{customStyles}</style>
      <Carousel
        autoplay
        dots={true}
        dotPosition={"bottom"}
        className={styles.carousel}
      >
        {birthdayUsers.map((user: any) => (
          <Card key={user.id} style={{ width: "100%", height: "450px" }}>
            <div>
              <img
                src={require("../assets/wish.svg")}
                alt="Happy Birthday"
                className={styles.wishImg}
              />
            </div>
            <div>
              <img
                src={`/_layouts/15/userphoto.aspx?size=L&username=${user.userPrincipalName}`}
                alt={user.displayName}
                className={styles.userPhoto}
              />
              {/* <p className={styles.wish}>Wishing you a fantastic birthday!</p> */}
              <p className={styles.userName}>{user.displayName}</p>
              <p className={styles.jobTitle}>{user.jobTitle}</p>
            </div>
          </Card>
        ))}
      </Carousel>
    </>
  );
};

export default BirthdayCarousel;
