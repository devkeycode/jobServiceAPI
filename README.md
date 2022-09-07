# Job Service API

---

- This Job Service API revolves around the listing jobs for the companies(through posting them) and provide a functionality for job seekers to apply for the active jobs.

### Features

---

- User SignUp(Registration) and SignIn Functionality
- Admin registration allowed, but user status will be pending for the Admin, so later an admin with approved status can approved the admin. At least one Admin with approved status registration will be inserted in the database directly.(For testing purpose, doing it, from the veryFirst time server started,in case no admin is there in the system).
- HR registration will be supported through API, but the company , HR belonged to must be approved then only HR will be able to register into the system.Though new HR status will be pending initially and later will be approved by the Admin.
- Applicant registration will be supported through API with no approval needed from the ADMIN, by default approved.
- API to support the ADMIN/HR/APPLICANT signIn. SignIn will be successfull in case of users have APPROVED userStatus . Successfull SignIn API call should return the access token, which will be used by the concerned user to make all the other calls on the protected endpoints.
- ADMIN or any HR from the company can post a job.
- Applicant can apply for the job, one time only.and in case job is expired, no applicant will be allowed to apply.

### Code organisation in the repository-

---

The whole code base is arranged in multiple directories and files.
Project follows Models, Controllers, Routes (MCR Architecture Pattern), to arrange the code.

1. Models directory contain files dealing with the defining the database Schemas.
2. Controllers directory contain files dealing with handling the core business logic.
3. Routes directory contain the files managing with the routes.
4. Middlewares directory to define all middlewares(generally related for validating incoming requests).
5. Utils directory contains the files that have reusable code(functions).
6. Configs directory for all configs file to configure all the configurations realted to server,database and authentication.
7. The main startup file is "server.js".

### Tech

---

Job Service API, uses a number of open source projects (all are npm packages) to work properly:

- [Express](https://www.npmjs.com/package/express)- Express is a web framework for node. Using it to create a server and managing dofferent routes.
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - For hashing the secret credentials of the user and verifying them.
- [dotenv](https://www.npmjs.com/package/dotenv) - Dotenv to load environment variables from a .env file into process.env
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) -For creating access token and verifying them.
- [mongoose](https://www.npmjs.com/package/mongoose) - Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
- this app requires Node.js(Runtime Environment) v16+ and mongodb v5+(Database, for persistance of data) to run.

#### Install the dependencies  by following instructions.

```sh
cd jobServiceAPI
npm install
```

##### Before running the app locally, ensure to change .env.sample to .env and rewrite all your configuration variables value over there.Incase running in production,ensure to configre those variables first in production and change the scripts property value under package.json file accordingly.

### Installation

---

- To make jobServiceAPI is up and running in your machine, follow the below steps after all configuration and related dependecies installation done.

```sh
cd jobServiceAPI
npm start
```

Express application,Job Service API will up and running on configured port.

### Different REST endpoints available ---

---

### 1.SignUp Request

---

```sh
POST /jobService/api/v1/auth/signup

Sample request body :
{
    "name":"applicant1",
    "userId":"applicant1",
    "email":"applicant1@email.com",
    "password":"password"  
}
Sample response body :
{
    "data": {
        "name": "applicant1",
        "email": "applicant1@email.com",
        "userId": "applicant1",
        "userType": "APPLICANT",
        "userStatus": "APPROVED",
        "createdAt": "2022-08-29T08:03:35.988Z",
        "updatedAt": "2022-08-29T08:03:35.988Z"
    },
    "message": "User created successfully."
}
```

Details about the JSON structure (Request Body)

- name : Mandatory
- userId : Manadatory and Unique
- email : Manadatory and Unique
- password : Mandatory and must have minimum 10 characters.
- userType : Optional, default value is APPLICANT.
  Allowed values : ADMIN | HR | APPLICANT
- userStatus : It reperesents the status of the registered user. Applicant are by default approved and for others it will be PENDING.Only Authorised ADMIN(With approved Status) can approve status of any newADMIN or HR, so to allow the user into the system.
  Allowed values : APPROVED | PENDING | REJECTED

##### NOTE-

- For user registring as HR userType has to pass the valid companyId and that company current verified status need to be APPROVED , then only HR registration will be successfull.

#### 2. SignIn request

---

```sh
POST /jobService/api/v1/auth/signin

Sample request body :
{ 
    "userId":"applicant1",
    "password":"password"   
}
Sample response body : 
{
    "data": {
        "name": "applicant1",
        "email": "applicant1@email.com",
        "userId": "applicant1",
        "userType": "APPLICANT",
        "userStatus": "APPROVED",
        "createdAt": "2022-08-29T08:03:35.988Z",
        "updatedAt": "2022-08-29T08:03:35.988Z",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFwcGxpY2FudDEiLCJpYXQiOjE2NjE3NjA4NDksImV4cCI6MTY2MTg0NzI0OX0.aYqcSjdBdc3NdNHmPpcoXCg3-shDkpFN6NQ6HPTBmTY"
    }
}
```

##### NOTE-

- Every User will get the accessToken after successfull signIn ,so to allow user to pass that token as x-access-token in headers along with request, instead of sending user credentials (like userId and password) to authenticate and authorized the user request on protected endpoints.If token verfied , then only user allowed to access the restricted resource data.

#### 3. Company Creation(POST) Request

NOTE- Only ADMIN User can add a company, and then can pass the generatedCompany Id to the company, so they can pass that companyId(required field for HR registration) to their hr's ,so they can register into the system.

---

```sh
POST /jobService/api/v1/companies
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjYxNzYzODEzLCJleHAiOjE2NjE4NTAyMTN9.pKfNnFgq62NmMxV9IPWTV91KPp9Vo-E0DJ5TgOxfUt8

Sample request body :
{
    "name":"Company1",
    "address":"Address1",
    "verified":"APPROVED"
}
Sample response body :
{
    "data": {
        "name": "Company1",
        "address": "Address1",
        "verified": "APPROVED",
        "jobsPosted": [],
        "hrs": [],
        "_id": "630c812e9731c4dab4987fac",
        "createdAt": "2022-08-29T09:04:46.171Z",
        "updatedAt": "2022-08-29T09:04:46.171Z"
    },
    "message": "Company created successfully"
}

```

Details about the JSON structure (Request Body)

- name : Mandatory
- address : Manadatory
- verified : Optional , if not passed will be by default PENDING. Allowed values -PENDING, APPROVED AND REJECTED

Maintianing company Verified status, so in future if admin want to block entire company from posting any job, admin can just block the company by changing verified property to desired value.

#### 4. Get all the companies (Only ADMIN with approved status allowed to access)

---

```sh
GET /jobService/api/v1/companies
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjYxNzYzODEzLCJleHAiOjE2NjE4NTAyMTN9.pKfNnFgq62NmMxV9IPWTV91KPp9Vo-E0DJ5TgOxfUt8

Sample request body : <EMPTY>
Sample response body:
{
    "documentResultsCount": 2,
    "data": [
        {
            "_id": "630c812e9731c4dab4987fac",
            "name": "Company1",
            "address": "Address1",
            "verified": "APPROVED",
            "jobsPosted": [],
            "hrs": [
                "630c85f79731c4dab4987fbf",
                "630c86909731c4dab4987fc8"
            ],
            "createdAt": "2022-08-29T09:04:46.171Z",
            "updatedAt": "2022-08-29T09:27:44.843Z"
        },
        {
            "_id": "630c84259731c4dab4987fb1",
            "name": "Company2",
            "address": "Address2",
            "verified": "PENDING",
            "jobsPosted": [],
            "hrs": [],
            "createdAt": "2022-08-29T09:17:25.899Z",
            "updatedAt": "2022-08-29T09:30:43.966Z"
        }
    ]
}
  
```

#### 5.Update a specific company details based on companyId (Only ADMIN with approved status allowed to access)

---

```sh
PUT /jobService/api/v1/companies
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjYxNzYzODEzLCJleHAiOjE2NjE4NTAyMTN9.pKfNnFgq62NmMxV9IPWTV91KPp9Vo-E0DJ5TgOxfUt8

Sample request body : 
{
    "name": "Company2",
    "address": "Address2",
    "verified":"APPROVED"  
}
Sample response body:
{
    "data": {
        "_id": "630c84259731c4dab4987fb1",
        "name": "Company2",
        "address": "Address2",
        "verified": "APPROVED",
        "jobsPosted": [],
        "hrs": [],
        "createdAt": "2022-08-29T09:17:25.899Z",
        "updatedAt": "2022-08-29T09:46:08.796Z"
    },
    "message": "Company successfully updated."
}

```

#### 6. Get all Users details, Request (Only ADMIN WITH Approved Status ALLOWED,TO get all the users details)

---

```sh
GET /jobService/api/v1/users
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjYxNzYzODEzLCJleHAiOjE2NjE4NTAyMTN9.pKfNnFgq62NmMxV9IPWTV91KPp9Vo-E0DJ5TgOxfUt8

Sample request body : <EMPTY>
Sample response body : 
{
    "documentResultsCount": 6,
    "data": [
        {
            "name": "John Doe",
            "email": "admin@email.com",
            "userId": "admin",
            "userType": "ADMIN",
            "userStatus": "APPROVED",
            "createdAt": "2022-08-29T04:40:59.897Z",
            "updatedAt": "2022-08-29T04:40:59.897Z"
        },
        {
            "name": "applicant1",
            "email": "applicant1@email.com",
            "userId": "applicant1",
            "userType": "APPLICANT",
            "userStatus": "APPROVED",
            "createdAt": "2022-08-29T08:03:35.988Z",
            "updatedAt": "2022-08-29T08:03:35.988Z"
        },
        {
            "name": "hr1",
            "email": "hr1@email.com",
            "userId": "hr1",
            "userType": "HR",
            "userStatus": "PENDING",
            "createdAt": "2022-08-29T09:25:11.734Z",
            "updatedAt": "2022-08-29T09:25:11.734Z"
        },
        {
            "name": "hr2",
            "email": "hr2@email.com",
            "userId": "hr2",
            "userType": "HR",
            "userStatus": "PENDING",
            "createdAt": "2022-08-29T09:27:44.835Z",
            "updatedAt": "2022-08-29T09:27:44.835Z"
        },
        {
            "name": "hr3",
            "email": "hr3@email.com",
            "userId": "hr3",
            "userType": "HR",
            "userStatus": "PENDING",
            "createdAt": "2022-08-29T09:53:41.165Z",
            "updatedAt": "2022-08-29T09:53:41.165Z"
        },
        {
            "name": "applicant2",
            "email": "applicant2@email.com",
            "userId": "applicant2",
            "userType": "APPLICANT",
            "userStatus": "APPROVED",
            "createdAt": "2022-08-29T09:56:54.897Z",
            "updatedAt": "2022-08-29T09:56:54.897Z"
        }
    ]
}
```

##### NOTE-

- ADMIN User may pass optional queryParameter, while sending the GET all users request, to filter the response.QueryParameter taken into account are -userStatus and userType.

#### 7. Get all Users details BASED on Optional QueryParameter, Request (Only ADMIN WITH Approved Status ALLOWED,TO get all the users details)

---

```sh
GET /jobService/api/v1/users?userType=<value>&userStatus=<value>

GET /jobService/api/v1/users?userType=APPLICANT  (EXAMPLE)
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjYxNzYzODEzLCJleHAiOjE2NjE4NTAyMTN9.pKfNnFgq62NmMxV9IPWTV91KPp9Vo-E0DJ5TgOxfUt8

Sample request body : <EMPTY>
Sample response body : 
{
    "documentResultsCount": 2,
    "data": [
        {
            "name": "applicant1",
            "email": "applicant1@email.com",
            "userId": "applicant1",
            "userType": "APPLICANT",
            "userStatus": "APPROVED",
            "createdAt": "2022-08-29T08:03:35.988Z",
            "updatedAt": "2022-08-29T08:03:35.988Z"
        },
        {
            "name": "applicant2",
            "email": "applicant2@email.com",
            "userId": "applicant2",
            "userType": "APPLICANT",
            "userStatus": "APPROVED",
            "createdAt": "2022-08-29T09:56:54.897Z",
            "updatedAt": "2022-08-29T09:56:54.897Z"
        }
    ]
}
```

#### 8. Get specific user based on userId, Request (Only ADMIN and the Concerend User(with approved Status), allowed to get specific user details)

---

```sh
GET /jobService/api/v1/users/:userId

GET /jobService/api/v1/users/hr1 (Example)
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjYxNzYzODEzLCJleHAiOjE2NjE4NTAyMTN9.pKfNnFgq62NmMxV9IPWTV91KPp9Vo-E0DJ5TgOxfUt8

Sample request body : <EMPTY>
Sample response body : 
{
    "data": {
        "name": "hr1",
        "email": "hr1@email.com",
        "userId": "hr1",
        "userType": "HR",
        "userStatus": "PENDING",
        "createdAt": "2022-08-29T09:25:11.734Z",
        "updatedAt": "2022-08-29T09:25:11.734Z"
    }
}
```

#### 9. Update specific user based on userId(passed as a request params), Request (Only ADMIN and the Concerend User(with approved Status), allowed to update user details) But Only the  ADMIN can change the userStatus.

---

```sh
PUT /jobService/api/v1/users/:userId

PUT /jobService/api/v1/users/hr1 (EXAMPLE)
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjYxNzYzODEzLCJleHAiOjE2NjE4NTAyMTN9.pKfNnFgq62NmMxV9IPWTV91KPp9Vo-E0DJ5TgOxfUt8

Sample request body :
{
    "userStatus":"APPROVED"
}
Sample response body:
{
    "message": "User updated successfully",
    "data": {
        "name": "hr1",
        "email": "hr1@email.com",
        "userId": "hr1",
        "userType": "HR",
        "userStatus": "APPROVED",
        "createdAt": "2022-08-29T09:25:11.734Z",
        "updatedAt": "2022-08-29T10:07:08.544Z"
    }
}

```

#### 10. HR User or ADMIN user,  can list a job  by Creating A Job

---

```sh
POST /jobService/api/v1/jobs
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImhyMSIsImlhdCI6MTY2MTc2Nzc3MywiZXhwIjoxNjYxODU0MTczfQ.h4hzmqEciEvavKQcl8fjSZo41Dd-ZZl4v3KIhl89Yr0

Sample request body :
{
    "title":"job1",
    "description":"desc1"
}
Sample response body :
{
    "message": "Job created successfully",
    "data": {
        "title": "job1",
        "description": "desc1",
        "status": "ACTIVE",
        "applicants": [],
        "company": "630c812e9731c4dab4987fac",
        "postedBy": "630c85f79731c4dab4987fbf",
        "_id": "630c90bf9731c4dab4988000",
        "createdAt": "2022-08-29T10:11:11.442Z",
        "updatedAt": "2022-08-29T10:11:11.442Z"
    }
}
```

NOTE-Jobs can be posted only for the companies with approved verified status.Also , If the admin is creating a job, on the behalf of the company, admin user must pass the valid companyId to create a job. For HR, companyId is not required, as it will be picked automatically from the records.

Details about the JSON structure (Request Body)

- title : Mandatory
- description : Manadatory
- companyId : Manadatory only if ADMIN is creating the job

#### 11. Get all the jobs (Applicant can search for all the jobs)

---

```sh
GET /jobService/api/v1/jobs
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFwcGxpY2FudDEiLCJpYXQiOjE2NjE3NDA5ODIsImV4cCI6MTY2MTgyNzM4Mn0.ioeUyyZeMWDAtNHZP4KX-cunp0HMU04wKFCHqCDgUIQ

Sample request body : <EMPTY>
Sample response body : 
{
    "documentResultsCount": 3,
    "data": [
        {
            "_id": "630c90bf9731c4dab4988000",
            "title": "job1",
            "description": "desc1",
            "status": "ACTIVE",
            "company": {
                "name": "Company1",
                "address": "Address1"
            },
            "postedBy": {
                "name": "hr1",
                "email": "hr1@email.com"
            }
        },
        {
            "_id": "630c916e9731c4dab4988006",
            "title": "job2",
            "description": "desc2",
            "status": "ACTIVE",
            "company": {
                "name": "Company1",
                "address": "Address1"
            },
            "postedBy": {
                "name": "hr1",
                "email": "hr1@email.com"
            }
        },
        {
            "_id": "630c919e9731c4dab498800d",
            "title": "job3",
            "description": "desc3",
            "status": "ACTIVE",
            "company": {
                "name": "Company2",
                "address": "Address2"
            },
            "postedBy": {
                "name": "hr3",
                "email": "hr3@email.com"
            }
        }
    ]
}

```

NOTE- If the user is Applicant, then user will get the the response as above, if user is Admin, the details will not be hidden from admin, and will get all the details.

#### 12. Applicant can get specific job detail based on job id(passed as a request params)

---

```sh
GET /jobService/api/v1/jobs/:jobId

GET /jobService/api/v1/jobs/630c90bf9731c4dab4988000 (EXAMPLE)
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFwcGxpY2FudDEiLCJpYXQiOjE2NjE3Njg3MzYsImV4cCI6MTY2MTg1NTEzNn0.3e_X-c-4b23mJ2VneOxx08VuWu-noqKtA6YaiFV01A0

Sample request body : <EMPTY>
Sample response body :
{
    "data": {
        "_id": "630c90bf9731c4dab4988000",
        "title": "job1",
        "description": "desc1",
        "status": "ACTIVE",
        "company": {
            "name": "Company1",
            "address": "Address1"
        },
        "postedBy": {
            "name": "hr1",
            "email": "hr1@email.com"
        }
    }
}

```

#### 12. Applicant can APPLY TO specific job (provided job is Active), by providing job id(passed as a request params),

---

```sh
PUT /jobService/api/v1/jobs/:jobId

PUT /jobService/api/v1/jobs/630c90bf9731c4dab4988000 (EXAMPLE)
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFwcGxpY2FudDEiLCJpYXQiOjE2NjE3Njg3MzYsImV4cCI6MTY2MTg1NTEzNn0.3e_X-c-4b23mJ2VneOxx08VuWu-noqKtA6YaiFV01A0

Sample request body : <EMPTY>
Sample response body :
{
    "message": "Job application is successfull."
}

```

NOTE- Owner of the job(hr user who posted the job) and Admin user can update the job details.

#### 13. HR user can get only jobs that are part of the company, to which hr belongs to. It has been done to hide the other company details.

---

```sh
GET /jobService/api/v1/jobs

Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImhyMyIsImlhdCI6MTY2MTc2OTQxMSwiZXhwIjoxNjYxODU1ODExfQ.vSXf8CzbEtVVP6HL8YnMp6ZQT4nKRONzTpy_aqN9XlA
 
Sample request body : <EMPTY>
Sample response body :
{
    "documentResultsCount": 1,
    "data": [
        {
            "_id": "630c919e9731c4dab498800d",
            "title": "job3",
            "description": "desc3",
            "status": "ACTIVE",
            "applicants": [
                "630c8d669731c4dab4987fe5"
            ],
            "company": "630c84259731c4dab4987fb1",
            "postedBy": "630c8ca59731c4dab4987fdd",
            "createdAt": "2022-08-29T10:14:54.394Z",
            "updatedAt": "2022-08-29T10:36:21.658Z"
        }
    ]
}
```

#### 14. ADMIN user can get all the jobs. NO RESTRICTION ON THE admin.

---

```sh
GET /jobService/api/v1/jobs

Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjYxNzcwNDUwLCJleHAiOjE2NjE4NTY4NTB9.rJqubdR_JXpJFI61NvoIOSyP2HuydQFfHKuQH8NiUl4
 
Sample request body : <EMPTY>
Sample response body :
{
    "documentResultsCount": 3,
    "data": [
        {
            "_id": "630c90bf9731c4dab4988000",
            "title": "job1",
            "description": "desc1",
            "status": "ACTIVE",
            "applicants": [
                "630c72d79731c4dab4987fa7",
                "630c8d669731c4dab4987fe5"
            ],
            "company": "630c812e9731c4dab4987fac",
            "postedBy": "630c85f79731c4dab4987fbf",
            "createdAt": "2022-08-29T10:11:11.442Z",
            "updatedAt": "2022-08-29T10:35:01.313Z"
        },
        {
            "_id": "630c916e9731c4dab4988006",
            "title": "job2",
            "description": "desc2",
            "status": "ACTIVE",
            "applicants": [],
            "company": "630c812e9731c4dab4987fac",
            "postedBy": "630c85f79731c4dab4987fbf",
            "createdAt": "2022-08-29T10:14:06.963Z",
            "updatedAt": "2022-08-29T10:14:06.963Z"
        },
        {
            "_id": "630c919e9731c4dab498800d",
            "title": "job3",
            "description": "desc3",
            "status": "ACTIVE",
            "applicants": [
                "630c8d669731c4dab4987fe5"
            ],
            "company": "630c84259731c4dab4987fb1",
            "postedBy": "630c8ca59731c4dab4987fdd",
            "createdAt": "2022-08-29T10:14:54.394Z",
            "updatedAt": "2022-08-29T10:36:21.658Z"
        }
    ]
}
```

#### 15. Any request of anytype on invalid endpoint , that doesnt exists, will send response status 404 NOTFOUND with proper response message

---

```sh
GET|POST|PUT|DELETE  /InvalidEndPoint

GET /anyinvalidEnpoint (Example)
Sample request body : <EMPTY>
Sample response body : 
{
   "message": "The requested endpoint doesn't exists."
}

```

##### NOTE-

- For all the request on protected endpoints, the validation has been taken care of, in case the validation not passed in any phase in the request processing pipeline, the proper response has been sent back from there only, without considering the request further into the processing pipeline.

```
NOTE- THE following code indicates the data in db after all the testing inputs entered.Using mongosh in command terminal, to query the db.

test> use demo_job_service_db
switched to db demo_job_service_db

demo_job_service_db> show collections
companies
jobs
users

demo_job_service_db> db.companies.find()
[
  {
    _id: ObjectId("630c812e9731c4dab4987fac"),
    name: 'Company1',
    address: 'Address1',
    verified: 'APPROVED',
    jobsPosted: [
      ObjectId("630c90bf9731c4dab4988000"),
      ObjectId("630c916e9731c4dab4988006")
    ],
    hrs: [
      ObjectId("630c85f79731c4dab4987fbf"),
      ObjectId("630c86909731c4dab4987fc8")
    ],
    createdAt: ISODate("2022-08-29T09:04:46.171Z"),
    updatedAt: ISODate("2022-08-29T10:14:06.967Z")
  },
  {
    _id: ObjectId("630c84259731c4dab4987fb1"),
    name: 'Company2',
    address: 'Address2',
    verified: 'APPROVED',
    jobsPosted: [ ObjectId("630c919e9731c4dab498800d") ],
    hrs: [ ObjectId("630c8ca59731c4dab4987fdd") ],
    createdAt: ISODate("2022-08-29T09:17:25.899Z"),
    updatedAt: ISODate("2022-08-29T10:14:54.397Z")
  }
]

demo_job_service_db> db.users.find().pretty()
[
  {
    _id: ObjectId("630c435b896ed17498a5e3ed"),
    name: 'John Doe',
    email: 'admin@email.com',
    userId: 'admin',
    password: '$2a$08$.1ZjXSR6fiECie5vUtKrxub/gCCb21llavDcZKtyn.8H.Z/jbHW/C',
    userType: 'ADMIN',
    userStatus: 'APPROVED',
    jobsApplied: [],
    createdAt: ISODate("2022-08-29T04:40:59.897Z"),
    updatedAt: ISODate("2022-08-29T04:40:59.897Z")
  },
  {
    _id: ObjectId("630c72d79731c4dab4987fa7"),
    name: 'applicant1',
    email: 'applicant1@email.com',
    userId: 'applicant1',
    password: '$2a$08$souc.j2N4lTRc8gdLbVTxu7pGxXpYgKnruJ4ChvHBu/hNcSlRTVm.',
    userType: 'APPLICANT',
    userStatus: 'APPROVED',
    jobsApplied: [ ObjectId("630c90bf9731c4dab4988000") ],
    createdAt: ISODate("2022-08-29T08:03:35.988Z"),
    updatedAt: ISODate("2022-08-29T10:31:07.393Z")
  },
  {
    _id: ObjectId("630c85f79731c4dab4987fbf"),
    name: 'hr1',
    email: 'hr1@email.com',
    userId: 'hr1',
    password: '$2a$08$0fmOxAnCb6Q8Hv/CP8EJiOP1/ywTG1RiOEKvi4xsgODR9S5Pz/ytW',
    userType: 'HR',
    userStatus: 'APPROVED',
    jobsApplied: [],
    companyId: ObjectId("630c812e9731c4dab4987fac"),
    createdAt: ISODate("2022-08-29T09:25:11.734Z"),
    updatedAt: ISODate("2022-08-29T10:07:08.544Z")
  },
  {
    _id: ObjectId("630c86909731c4dab4987fc8"),
    name: 'hr2',
    email: 'hr2@email.com',
    userId: 'hr2',
    password: '$2a$08$J9KXyJ3fD5Nj90QtQBEmq.mOInm/kmC6crG3LPu8HtIVC8DAmM8jK',
    userType: 'HR',
    userStatus: 'APPROVED',
    jobsApplied: [],
    companyId: ObjectId("630c812e9731c4dab4987fac"),
    createdAt: ISODate("2022-08-29T09:27:44.835Z"),
    updatedAt: ISODate("2022-08-29T10:08:18.006Z")
  },
  {
    _id: ObjectId("630c8ca59731c4dab4987fdd"),
    name: 'hr3',
    email: 'hr3@email.com',
    userId: 'hr3',
    password: '$2a$08$EjfBrLFIa7ki2YgoOPpv6uTp64v6rPaqPN1ZjrYADADkhucyg7Je.',
    userType: 'HR',
    userStatus: 'APPROVED',
    jobsApplied: [],
    companyId: ObjectId("630c84259731c4dab4987fb1"),
    createdAt: ISODate("2022-08-29T09:53:41.165Z"),
    updatedAt: ISODate("2022-08-29T10:08:21.469Z")
  },
  {
    _id: ObjectId("630c8d669731c4dab4987fe5"),
    name: 'applicant2',
    email: 'applicant2@email.com',
    userId: 'applicant2',
    password: '$2a$08$/kNSVwj7.8f0L9VBbY6LdeMhh8jq3WxxR5G4SpoWxXTdsiu1xAFU6',
    userType: 'APPLICANT',
    userStatus: 'APPROVED',
    jobsApplied: [
      ObjectId("630c90bf9731c4dab4988000"),
      ObjectId("630c919e9731c4dab498800d")
    ],
    createdAt: ISODate("2022-08-29T09:56:54.897Z"),
    updatedAt: ISODate("2022-08-29T10:36:21.662Z")
  }
]

demo_job_service_db> db.jobs.find().pretty()
[
  {
    _id: ObjectId("630c90bf9731c4dab4988000"),
    title: 'job1',
    description: 'desc1',
    status: 'ACTIVE',
    applicants: [
      ObjectId("630c72d79731c4dab4987fa7"),
      ObjectId("630c8d669731c4dab4987fe5")
    ],
    company: ObjectId("630c812e9731c4dab4987fac"),
    postedBy: ObjectId("630c85f79731c4dab4987fbf"),
    createdAt: ISODate("2022-08-29T10:11:11.442Z"),
    updatedAt: ISODate("2022-08-29T10:35:01.313Z")
  },
  {
    _id: ObjectId("630c916e9731c4dab4988006"),
    title: 'job2',
    description: 'desc2',
    status: 'ACTIVE',
    applicants: [],
    company: ObjectId("630c812e9731c4dab4987fac"),
    postedBy: ObjectId("630c85f79731c4dab4987fbf"),
    createdAt: ISODate("2022-08-29T10:14:06.963Z"),
    updatedAt: ISODate("2022-08-29T10:14:06.963Z")
  },
  {
    _id: ObjectId("630c919e9731c4dab498800d"),
    title: 'job3',
    description: 'desc3',
    status: 'ACTIVE',
    applicants: [ ObjectId("630c8d669731c4dab4987fe5") ],
    company: ObjectId("630c84259731c4dab4987fb1"),
    postedBy: ObjectId("630c8ca59731c4dab4987fdd"),
    createdAt: ISODate("2022-08-29T10:14:54.394Z"),
    updatedAt: ISODate("2022-08-29T10:36:21.658Z")
  }
]

demo_job_service_db>
```
