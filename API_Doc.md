# API Documentation

This document provides a basic overview of the Pokémon Team Builder API endpoints.

## Base URL

All API endpoints are relative to the base URL where the application is hosted (e.g., `http://localhost:4000` during local development).

## Authentication

Most endpoints require JWT authentication. To authenticate:

1.  Register a new user or log in an existing user via the `/users/register` or `/users/login` endpoints respectively.
2.  A successful login will return a JWT token.

---

## User Routes

Base path: `/users`

### 1. Register User

*   **Endpoint:** `POST /register`
*   **Description:** Creates a new user.
*   **Request Body:**
    ```json
    {
      "username": "newuser",
      "password": "password123"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "User registered successfully"
    }
    ```

### 2. Login User

*   **Endpoint:** `POST /login`
*   **Description:** Logs in an existing user and returns a JWT.
*   **Request Body:**
    ```json
    {
      "username": "testuser",
      "password": "password123"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Login successful",
      "token": "jwt_token"
    }
    ```

---

## Pokémon Build Routes

Base path: `/builds`

**Note:** All Pokémon Build routes require authentication.

### 1. Create Pokémon Build

*   **Endpoint:** `POST /`
*   **Description:** Creates a new Pokémon build for the authenticated user.
*   **Request Body:** (Example)
    ```json
    {
      "nickname": "My Charizard",
      "species": "Charizard",
      "moves": ["Flamethrower", "Air Slash", "Solar Beam", "Focus Blast"],
      "ability": "Blaze",
      "item": "Charizardite Y",
      "nature": "Timid",
      "stats": {
        "hp": 78,
        "attack": 84,
        "defense": 78,
        "specialAttack": 109,
        "specialDefense": 85,
        "speed": 100
      }
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "data": { /* Pokémon Build Object */ }
    }
    ```

### 2. Get All Pokémon Builds

*   **Endpoint:** `GET /`
*   **Description:** Retrieves all Pokémon builds for the authenticated user.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [ /* Array of Pokémon Build Objects */ ]
    }
    ```

### 3. Get Single Pokémon Build

*   **Endpoint:** `GET /:id`
*   **Description:** Retrieves a specific Pokémon build by its ID, if it belongs to the authenticated user.
*   **URL Parameters:**
    *   `id`: The ID of the Pokémon build.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": { /* Pokémon Build Object */ }
    }
    ```
*   **Error Response (404 Not Found):** If build doesn't exist or doesn't belong to the user.

### 4. Update Pokémon Build

*   **Endpoint:** `PUT /:id`
*   **Description:** Updates a specific Pokémon build by its ID, if it belongs to the authenticated user.
*   **URL Parameters:**
    *   `id`: The ID of the Pokémon build to update.
*   **Request Body:** (Fields to update, e.g., `nickname`, `moves`)
    ```json
    {
      "nickname": "Updated Charizard",
      "item": "Life Orb"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": { /* Updated Pokémon Build Object */ }
    }
    ```

### 5. Delete Pokémon Build

*   **Endpoint:** `DELETE /:id`
*   **Description:** Deletes a specific Pokémon build by its ID, if it belongs to the authenticated user.
*   **URL Parameters:**
    *   `id`: The ID of the Pokémon build to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Build deleted successfully"
    }
    ```

---

## Team Routes

Base path: `/teams`

**Note:** All Team routes require authentication.

### 1. Create Team

*   **Endpoint:** `POST /`
*   **Description:** Creates a new team for the authenticated user.
*   **Request Body:**
    ```json
    {
      "name": "My Awesome Team",
      "description": "A team for competitive battles.",
      "pokemonBuilds": ["buildId1", "buildId2"] // Optional array of Pokémon Build IDs
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "data": { /* Team Object */ }
    }
    ```

### 2. Get All Teams

*   **Endpoint:** `GET /`
*   **Description:** Retrieves all teams for the authenticated user.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [ /* Array of Team Objects */ ]
    }
    ```

### 3. Get Single Team

*   **Endpoint:** `GET /:id` (Note: The route is `/teams/:id` as per your `teamRoutes.js`)
*   **Description:** Retrieves a specific team by its ID, if it belongs to the authenticated user.
*   **URL Parameters:**
    *   `id`: The ID of the team.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": { /* Team Object, populated with builds */ }
    }
    ```

### 4. Update Team

*   **Endpoint:** `PUT /:id`
*   **Description:** Updates a team's name or description.
*   **URL Parameters:**
    *   `id`: The ID of the team to update.
*   **Request Body:**
    ```json
    {
      "name": "My Updated Awesome Team",
      "description": "Revised description."
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": { /* Updated Team Object */ }
    }
    ```

### 5. Delete Team

*   **Endpoint:** `DELETE /:id`
*   **Description:** Deletes a specific team by its ID.
*   **URL Parameters:**
    *   `id`: The ID of the team to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Team deleted successfully"
    }
    ```

### 6. Add Pokémon Build to Team

*   **Endpoint:** `POST /:id/pokemon/:buildId`
*   **Description:** Adds an existing Pokémon build to a team.
*   **URL Parameters:**
    *   `id`: The ID of the team.
    *   `buildId`: The ID of the Pokémon build to add.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": { /* Updated Team Object */ }
    }
    ```

### 7. Remove Pokémon Build from Team

*   **Endpoint:** `DELETE /:id/pokemon/:buildId`
*   **Description:** Removes a Pokémon build from a team.
*   **URL Parameters:**
    *   `id`: The ID of the team.
    *   `buildId`: The ID of the Pokémon build to remove.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": { /* Updated Team Object */ }
    }
    ```

### 8. Get Available Pokémon Builds for a Team

*   **Endpoint:** `GET /available-builds`
*   **Description:** Retrieves Pokémon builds for the authenticated user that are not currently assigned to any team.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [ /* Array of available Pokémon Build Objects */ ]
    }
    ```
