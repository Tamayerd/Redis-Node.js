# Node.js Redis CRUD Operations

This repository contains Node.js code snippets for performing CRUD (Create, Read, Update, Delete) operations with Redis. It includes controllers for managing configurations, devices, and user authentication, as well as server initialization and a data access object (DAO) for handling database operations.
(This project can be enhanced and accelerated.)

## Introduction

Redis is an open-source, in-memory data structure store used as a database, cache, and message broker. This project demonstrates how to implement CRUD operations with Redis in a Node.js environment, providing a scalable and efficient solution for managing data.

## Installation

To run this project locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone [ https://github.com/your-username/your-repository.git](https://github.com/Tamayerd/Redis-Node.js.git)
    ```

2. **Navigate to the project directory:**

    ```bash
    cd Redis-Node.js
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Start the server:**

    ```bash
    npm start
    ```

## Usage

### ConfigurationsController

The `ConfigurationsController` handles operations related to configurations stored in Redis. It provides endpoints for listing, creating, updating, and deleting configurations.


### LoginController

The `LoginController` handles user authentication and management. It provides endpoints for user login, logout, creation, deletion, and updating width Redis.


### Data Access Object (DAO)

The `deviceRepository` is a repository for handling device data operations using Redis. It provides methods for saving, fetching, updating, and deleting device data.

## Dependencies

- redis
- redis-om
- express
- cors
- bcrypt
- dotenv
- node-cache

