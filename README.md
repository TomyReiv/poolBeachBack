# API Documentation

## Endpoints

### 1. `GET /api/users`

- **Description**: Retrieve a list of users.
- **Inputs**: None
- **Outputs**:
  - **200 OK**:
    ```json
    [
      {
        "id": "string",
        "name": "string",
        "email": "string"
      }
    ]
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "error": "string"
    }
    ```

### 2. `POST /api/users`

- **Description**: Create a new user.
- **Inputs**:
  - **Request Body**:
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string"
    }
    ```
- **Outputs**:
  - **201 Created**:
    ```json
    {
      "id": "string",
      "name": "string",
      "email": "string"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "string"
    }
    ```

### 3. `GET /api/users/{id}`

- **Description**: Retrieve a user by ID.
- **Inputs**:
  - **Path Parameter**: `id` (string)
- **Outputs**:
  - **200 OK**:
    ```json
    {
      "id": "string",
      "name": "string",
      "email": "string"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "string"
    }
    ```

### 4. `PUT /api/users/{id}`

- **Description**: Update a user by ID.
- **Inputs**:
  - **Path Parameter**: `id` (string)
  - **Request Body**:
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string"
    }
    ```
- **Outputs**:
  - **200 OK**:
    ```json
    {
      "id": "string",
      "name": "string",
      "email": "string"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "string"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "string"
    }
    ```

### 5. `DELETE /api/users/{id}`

- **Description**: Delete a user by ID.
- **Inputs**:
  - **Path Parameter**: `id` (string)
- **Outputs**:

  - **204 No Content**
  - **404 Not Found**:

    ```json
    {
      "error": "string"
    }
    ```

    ### 6. `GET /api/bookings`

    - **Description**: Retrieve a list of bookings.
    - **Inputs**: None
    - **Outputs**:
      - **200 OK**:
        ```json
        [
          {
            "id": "string",
            "user_id": "string",
            "event_id": "string",
            "status": "string"
          }
        ]
        ```
      - **500 Internal Server Error**:
        ```json
        {
          "error": "string"
        }
        ```

    ### 7. `POST /api/bookings`

    - **Description**: Create a new booking.
    - **Inputs**:
      - **Request Body**:
        ```json
        {
          "user_id": "string",
          "event_id": "string",
          "status": "string"
        }
        ```
    - **Outputs**:
      - **201 Created**:
        ```json
        {
          "id": "string",
          "user_id": "string",
          "event_id": "string",
          "status": "string"
        }
        ```
      - **400 Bad Request**:
        ```json
        {
          "error": "string"
        }
        ```

    ### 8. `GET /api/events`

    - **Description**: Retrieve a list of events.
    - **Inputs**: None
    - **Outputs**:
      - **200 OK**:
        ```json
        [
          {
            "id": "string",
            "name": "string",
            "date": "string",
            "location": "string"
          }
        ]
        ```
      - **500 Internal Server Error**:
        ```json
        {
          "error": "string"
        }
        ```

    ### 9. `POST /api/events`

    - **Description**: Create a new event.
    - **Inputs**:
      - **Request Body**:
        ```json
        {
          "name": "string",
          "date": "string",
          "location": "string"
        }
        ```
    - **Outputs**:
      - **201 Created**:
        ```json
        {
          "id": "string",
          "name": "string",
          "date": "string",
          "location": "string"
        }
        ```
      - **400 Bad Request**:
        ```json
        {
          "error": "string"
        }
        ```

    ### 10. `GET /api/sunbeds`

    - **Description**: Retrieve a list of sunbeds.
    - **Inputs**: None
    - **Outputs**:
      - **200 OK**:
        ```json
        [
          {
            "id": "string",
            "location": "string",
            "status": "string"
          }
        ]
        ```
      - **500 Internal Server Error**:
        ```json
        {
          "error": "string"
        }
        ```

    ### 11. `POST /api/sunbeds`

    - **Description**: Create a new sunbed.
    - **Inputs**:
      - **Request Body**:
        ```json
        {
          "location": "string",
          "status": "string"
        }
        ```
    - **Outputs**:
      - **201 Created**:
        ```json
        {
          "id": "string",
          "location": "string",
          "status": "string"
        }
        ```
      - **400 Bad Request**:
        ```json
        {
          "error": "string"
        }
        ```
