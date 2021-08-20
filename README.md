# Backend dev challenge
[![Deployment to Heroku](https://github.com/Zineeddine998/Backend_challenge/actions/workflows/secondary.yml/badge.svg)](https://github.com/Zineeddine998/Backend_challenge/actions/workflows/secondary.yml)
[![Docker Hub Deployment](https://github.com/Zineeddine998/Backend_challenge/actions/workflows/main.yml/badge.svg)](https://github.com/Zineeddine998/Backend_challenge/actions/workflows/main.yml)

Rest Api for a survey management platform
#
### Main features : 

Api to create, take and manage surveys, it operates on 5 main routes:

-   Surveys (list, filter, create, update, delete, take, metrics/statistics)
-   Questions (list, filter, create, update, delete, upload description image, metrics, statistics)
-   Entries (results when taking a survey - same previous operations)
-   Answers (same operations)
-   Auth (admin only) (register, login, logout, forgot password, reset password + manipulation operations on all objects and protected routes)

### Technical Implementation :
**Tech Stack**
* **NodeJS**  runtime environment
* **Express.js** back-end framework
* **Mongodb** database
* **lowDB** in-memory database
* **Mongoose** ODM
* CI/CD with **GitHub Actions** 
* Containers registry and management with  **Docker Hub**
* Deployment with **Heroku** server running **Docker engine**


**Deployment Pipeline** 
<p align="center">
<img src="https://res.cloudinary.com/donifk2pu/image/upload/v1629420475/Deployment_pipeline_yfowyu.png"
  alt="Deployment pipeline"
  width="" height="">
</p>


## Packages and libraries used

* [Chai](https://www.chaijs.com/), [Mocha](https://github.com/mobxjs/mobx), [Jest](https://jestjs.io/) and [supertest](https://www.npmjs.com/package/supertest) for unit and integration testing
* [mongoose](https://mongoosejs.com/) for data interaction with MongoDB
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) for authentication and token management
* [cookie-parser](https://www.npmjs.com/package/cookie-parser) for session management
* [rotating-file-stream](https://www.npmjs.com/package/rotating-file-stream) for periodic logging info persistence
* [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) for documentation generation
* [nodemailer](https://nodemailer.com/about/) for server-side email sending
* [cloudinary](https://cloudinary.com/) for images manipulation and storage
* [bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing




## Usage

### Production 
 * Swagger documentation and playground for the api are available [here](https://pacific-crag-09866.herokuapp.com/api-docs)(make sure to set the server as "production environment" in swagger)
 * Postman static api documentation is available [here](https://documenter.getpostman.com/view/17089549/TzzBqGEe)

### Run Server locally

1. Clone the repository

2. Install dependencies : 
    ```sh
    $ npm install
    ```
3. Start the server
    ```sh
    $ npm run start
    ```
4. Open browser and head over to the link : 
    ```sh
    $ http://localhost:5000/api-docs
    ```
5. Swagger documentation interface : 
#
<p align="center">
<img src="https://res.cloudinary.com/donifk2pu/image/upload/v1629421577/Screenshot_from_2021-08-20_02-02-24_m2p9pb.png"
  alt="Swagger"
  width="" height="">
</p>


#
6. Select `Development environment` as shown below : 
#
<p align="center">
<img src="https://res.cloudinary.com/donifk2pu/image/upload/v1629421578/Screenshot_from_2021-08-20_02-04-29_zey29v.png"
  alt="Swagger2"
  width="" height="">
</p>

#

The Server is ready for local testing

## Notes and potential improvements

### Performance
The perceived latency and delay in requests time (particularly on production environment) can be linked to the following reasons:
 * **Hardware limitations** since most of the components in the deployment pipeline uses the free-tier resources of their respective service provider which tend to be used for prototyping and not for testing. 
 * **Third party services** such as Cloudinary that is also using the free tier which has variant response time.
 * **Dyno cold start** (Heroku server stops automatically when there are no requests to the server for a period of 30min and it take 5-10 seconds for the server to move from its idle state when a new request is initiated).

### Security
Here are all security considerations that are included in api:
 * Protection from **DOS attacks** with rate limiting.
 * Protection from **NoSQL injections** using express-mongo-sanitize which sanitizes mongodb queries against query selector injections.
 * Protection from **cross-site scripting** with **helmet** and **xss-clean**.


### Improvements :

 * Setup indexing on mongodb and leverage denormalized data models to speed up queries.
 * Swap lowDB with redis since the latter has better support for caching.
 * Introduce end-to-end monitoring for the deployment pipeline.
 * Extend the deployment setup to run multiple instances of the server and add load balancing.
 * Conternize the mongodb server instance and include it in the deployment setup.



