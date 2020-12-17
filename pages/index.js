import Head from 'next/head';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import * as aws from 'aws-sdk';
import { Refresh } from '@material-ui/icons'



// 0: {name: "Mick", latestImage: "", canFire: false}
// 1: {name: "Maddy", latestImage: "", canFire: false}
// 2: {name: "Hung", latestImage: "", canFire: false}
// 3: {name: "Oscar", latestImage: "", canFire: false}


export default function Home() {

  const [staffDetails, setStaffDetails] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // setInterval(() => {
      axios.get('https://hackathon2020-teeea.s3-ap-southeast-2.amazonaws.com/dashboard.json', {}).then((response) => {
      setStaffDetails(response.data);
      console.log(staffDetails);
    }).catch(error => {
      console.log(error);
    })
    // }, 3000);
  }, []);

  useEffect(() => {
    setStaffDetails(staffDetails);
    setRefresh(false);
  }, [refresh])

  function canFire(staff) {
    const index = staffDetails.staff.findIndex(x => x.name === staff.name);
    staffDetails.staff[index].canRehire = true;
    staffDetails.staff[index].canFire = false;
    setRefresh(true);
    // axios.post('https://holvhwdnr4.execute-api.us-east-1.amazonaws.com/dev/fire', {
    //   name: 'Mick'
    // }).then(resposne => {
    //   console.log(response);
    // }).catch(error => {
    //   console.log(error);
    // })
  }

  function canRehire(staff) {
    const index = staffDetails.staff.findIndex(x => x.name === staff.name);
    staffDetails.staff[index].canRehire = false;
    staffDetails.staff[index].canFire = true;
    setRefresh(true);
  }

  function reset() {
    const s3Bucket = new aws.S3({
    });

    const resetValue = {
      staff: [
        {
          name: 'Mick',
          latestImage: '',
          canFire: true,
          onLeave: true,
        },
        {
          name: 'Maddy',
          latestImage: '',
          canFire: true,
          onLeave: true,
        },
        {
          name: 'Hung',
          latestImage: '',
          canFire: true,
          onLeave: true,
        },
        {
          name: 'Oscar',
          latestImage: '',
          canFire: false,
          onLeave: true,
        }
      ]
    }

    const params = {
      Bucket: 'hackathon2020-teeea',
      Key: `dashboard.json`,
      Body: JSON.stringify(resetValue),
      ContentType: 'application/json',
      ACL: 'public-read'
    }
    s3Bucket.upload(params, (err, data) => {
      if (err) {
        console.log(err);
      }
      console.log('Success');
      console.log(data);
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Sicky</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.heading}>
          <h1 className={styles.title}>
            Good Morning, Michael 👋
            <Refresh onClick={reset} style={{fontSize: '30px', cursor: 'pointer', position: 'absolute', right: '-32%'}}/>
          </h1>
          <p className={styles.description}>
          Leave requests
          </p>
        </div>

        {
          staffDetails.staff ? (
            <div className={styles.grid}>
            { staffDetails.staff.map((staff, i) => 
             staff.onLeave ? (
              <a key={i} className={styles.card}>
                <h2>{staff.name}</h2>
                <div className={styles.twoImage}>
                  <img src="pics/Hung.png" width="140"/>
                  <img src="pics/Maddy.png" width="140"/>
                </div>
                <div className={styles.buttonDiv}>
                  <button className={styles.primaryButton}>Approve</button>
                  {
                    staff.canFire ? (
                      <button className={styles.secondaryButton} onClick={() => canFire(staff)}>Fire {staff.name}</button>
                    ) : null
                  }
                  {
                    staff.canRehire ? (
                      <button className={styles.rehireButton} onClick={() => canRehire(staff)}>Rehire {staff.name}</button>
                    ) : null
                  }
                </div>
              </a>
              ) : null
              )}
            </div>
          ) : (
            // <div className={styles.grid}>
              <div className={styles.singleCard}>
                <h3>Looks like no one applied for leave. Everyone are happy to come to office. Good work Mick.</h3>
              </div>
            // </div>
          )
        }
      </main>
    </div>
  )
}
