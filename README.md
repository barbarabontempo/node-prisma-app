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
- Step 5: Generating traces with prisma queries

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

### Step 5: Generating traces with prisma queries

## Frameworks and Libraries

This application uses a number of libraries:
- [node.js] - for the backend
- [Express] - fast node.js network app framework
- [Prisma] - an open-source ORM for Node.js and TypeScript