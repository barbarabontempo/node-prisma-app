# APM: Docker + Express + Prisma + PG + Typescript

This sandbox was created to test and workwith Datadogs Node Tracer. You will be working with a REST API that contains routes using Express for a small blogging application in TypeScript using Prisma and a PostgreSQL database. All REST API routes will be tested using curl, a terminal-based HTTP client.

## Getting Started
This sandbox requires [Docker](https://docs.docker.com/get-docker/) to run.
Confirm your version like so:

```sh
docker -v
```

## Sections

- Step 1: Configure the ENV file with your Datadog Agent API Key 
- Step 2: Spin up Docker containers
- Step 3: Migrate prisma schema
- Step 4: Generating Traces
- Step 5: Shutting it down

### Step 1: Configure the ENV file with your Datadog Agent API Key 

Make sure that in your `~` directory, you have a file called `sandbox.docker.env` that contains:

```
DD_API_KEY=<Your API Key>
```

Now when you run the next steps, you don't have to worry about your API Key in plain text somehow making its way into the repo.


### Step 2: Spin up Docker containers

1. Build the image: `docker-compose build`
2. Spin up the containers: `docker-compose up` or `docker-compose up -d` to run containers in the background.

### Step 3: Migrate prisma schema

Navigate to your Docker dashboard and check that all your images are up and running: 
![Docker images running](https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/KouAXjoK/8578eace-651c-4173-9e70-8283ead86fe1.jpg?source=viewer&v=a7eb210fab1808b2d0ec7882fb5e1f17)

postgres - to execute and run the Postgres database container on port 5432. To access the database, set the environment as POSTGRES_USER: postgres, POSTGRES_PASSWORD: postgres, and POSTGRES_DB: myblog.

nose-prisma-app_datadog-agent_1 - This is the Datadog Agent image that are Traces will be sent to.

pgadmin - Pgadmin will help you have a visual representation of the Postgres database. It has an interactive UI that lets you see the data that you manipulate. Prisma automatically sets this database and table.

prisma-postgres-api - this service runs the Prisma API that you have just created. It will access the Postgres service, run the Prisma schema and populate our data models to the database.

Then, hover over the prisma-postgres-api and open the integrated Docker API: 
![Prisma cli](https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/d5u9qOo8/6d6bd25c-8631-446e-8af5-e9bfce823347.jpg?source=viewer&v=1e49063635c2c85acb601b73a3aefb48)

This will launch an interactive CLI to run your API commands. In this case, you want to run the `npx prisma migrate dev` command. This will allow the database to sync with the schema in the application.

### Step 4: Generating traces

| HTTP Method  | Route         | Description |
| :-------------|:-------------:|:------------------|
| GET          | /users             | Fetches all created users. |
| GET          | /feed              | Fetches all published posts. |
| GET          | /post/:id          | Fetches a specific post by its ID. |
| POST         | /user              | Creates a new user. |
| POST         | /post              | Creates a new post (as a draft). |
| PUT          | /post/publish/:id  | Sets the published field of a post to true. |
| DELETE       | post/:id           | Deletes a post by its ID. |


1. Create a user:

```
curl -X POST -H "Content-Type: application/json" -d '{"name":"Barb", "email":"barb@gmail.com"}' http://localhost:3000/user
```

2. To create a post:

```
curl -X POST -H "Content-Type: application/json" -d '{"title":"I like green eggs and ham", "authorEmail":"barb@gmail.com"}' http://localhost:3000/post
```

3. To pubilish a post:

```
curl -X PUT http://localhost:3000/post/publish/1
```

4. To see all users:

```
curl http://localhost:3000/users
```

5. To see feed of published posts:

```
curl http://localhost:3000/feed
```

6. To delete a post: 

```
curl -X DELETE http://localhost:3000/post/1
```
### Step 5: Shutting it down

If you are still in the same terminal you have initialized the app from, you can use Ctrl + C to stop the containers, then run docker-compose down to remove the containers and the network. If you are in a different terminal, you can simply run docker-compose down to both stop the application and remove the containers/network.

## Credit
I was able to get the prisma query traces to appear on Datadog thanks to the solution provided in this Github issue: https://github.com/DataDog/dd-trace-js/issues/1244

## Frameworks and Libraries

This application uses a number of libraries:
- [node.js] - for the backend
- [Express] - fast node.js network app framework
- [Prisma] - an open-source ORM for Node.js and TypeScript