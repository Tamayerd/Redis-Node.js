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

### Devices Controller for Managing Device Data

This repository contains a Node.js controller class (`DevicesController`) designed to manage device data operations, such as saving device information, logging static messages, and retrieving device locations.

## Functions

# `saveDevice(req)`

This function saves device data received in the request (`req`). Data for multiple devices is expected in the form of an array within `req.body`. Each device must have a unique identifier (`device_id`). The function tracks saved device identifiers in a `Set` to ensure duplicates are not saved. Each device may have an array of elements in its latest log (`latest_log`) containing `id`, `can_message_id`, `name`, and `data`. This function saves each device to the database and logs a notification to the console with the saved device's identifier.

# `staticMessageLogs(req)`

This function is used to log static message entries. It processes request data (`req.body`) also expected in the form of an array. Each device must have a unique identifier (`device_id`). Each device may have an array of elements in its latest log (`latest_log`) containing `static_message_id` and `data`. This function saves each device to the database and logs a notification to the console with the saved device's identifier.

# `device_locations(req, res)`

This function retrieves the location of a specific device. It takes the device identifier (`device_id`) from the request (`req`) parameters. It searches for devices with this identifier in the database and returns the found devices (`dev`). This function also catches and throws an error in case of any potential issues.


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

