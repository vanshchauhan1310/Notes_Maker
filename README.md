# NoteMark – Personal Notes & Bookmarks Manager

A beautiful, full-stack app for managing personal notes and bookmarks, featuring search, tag filtering, favorites, and CRUD operations. Built with Next.js, Tailwind CSS, Supabase, and modern UI/UX best practices.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Backend (Supabase)](#backend-supabase)
  - [Frontend (Next.js)](#frontend-nextjs)
- [API Documentation](#api-documentation)
  - [Notes Endpoints](#notes-endpoints)
  - [Bookmarks Endpoints](#bookmarks-endpoints)
  - [Metadata Endpoint](#metadata-endpoint)
- [Sample Requests](#sample-requests)
- [Skills Demonstrated](#skills-demonstrated)

---

## Features

- User authentication (Supabase Auth)
- Create, read, update, delete (CRUD) for notes and bookmarks
- Tagging, search, and advanced filtering
- Favorites support and sorting
- Responsive, modern UI with Tailwind CSS
- Clean code, robust error handling, and real-world data modeling

---

## Project Structure

```
/app
  /api
    /notes
      route.ts         # Notes list/create API
      [id]/route.ts    # Note detail/update/delete API
    /bookmarks
      route.ts         # Bookmarks list/create API
      [id]/route.ts    # Bookmark detail/update/delete API
    /metadata
      route.ts         # Fetches metadata for a given URL
  /notes               # Notes pages (list, detail, edit, etc.)
  /bookmarks           # Bookmarks pages (list, detail, edit, etc.)
/components            # Reusable UI components
/lib                   # Supabase client, types
/tailwind.config.ts    # Tailwind CSS config
/package.json          # Project dependencies and scripts
```

---

## Setup Instructions

### Backend (Supabase)

1. **Create a Supabase project** at https://app.supabase.com.
2. **Create tables** for `notes` and `bookmarks` with the following fields:

   - **notes**
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key to auth.users)
     - `title` (text)
     - `content` (text)
     - `tags` (text[], array)
     - `is_favorite` (boolean)
     - `updated_at` (timestamp, default: now())
   - **bookmarks**
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key to auth.users)
     - `url` (text)
     - `title` (text)
     - `description` (text)
     - `tags` (text[], array)
     - `is_favorite` (boolean)
     - `favicon_url` (text)
     - `updated_at` (timestamp, default: now())

3. **Enable Row Level Security (RLS)** and add policies so users can only access their own data.

4. **Get your Supabase project URL and anon key** from the project settings.

### Frontend (Next.js)

1. **Clone this repository** and install dependencies:

   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   npm install
   ```

2. **Configure environment variables** in a `.env.local` file:

   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Documentation

All endpoints require authentication via Supabase Auth (JWT in cookies).

### Notes Endpoints

#### `GET /api/notes`

- **Query params:**  
  - `q` (string, optional): Search in title/content  
  - `tags` (comma-separated, optional): Filter by tags  
  - `favorites` (boolean, optional): Only favorites

- **Response:**  
  `200 OK` – Array of notes

#### `POST /api/notes`

- **Body:**  
  ```json
  {
    "title": "string",
    "content": "string",
    "tags": ["string"],
    "is_favorite": false
  }
  ```
- **Response:**  
  `201 Created` – Created note object

#### `GET /api/notes/[id]`

- **Response:**  
  `200 OK` – Note object  
  `404 Not Found` if not found

#### `PUT /api/notes/[id]`

- **Body:**  
  Same as POST
- **Response:**  
  `200 OK` – Updated note object

#### `DELETE /api/notes/[id]`

- **Response:**  
  `200 OK` – `{ "message": "Note deleted successfully" }`

---

### Bookmarks Endpoints

#### `GET /api/bookmarks`

- **Query params:**  
  - `q` (string, optional): Search in title/description/url  
  - `tags` (comma-separated, optional): Filter by tags  
  - `favorites` (boolean, optional): Only favorites

- **Response:**  
  `200 OK` – Array of bookmarks

#### `POST /api/bookmarks`

- **Body:**  
  ```json
  {
    "url": "string",
    "title": "string",
    "description": "string",
    "tags": ["string"],
    "is_favorite": false,
    "favicon_url": "string"
  }
  ```
- **Response:**  
  `201 Created` – Created bookmark object

#### `GET /api/bookmarks/[id]`

- **Response:**  
  `200 OK` – Bookmark object  
  `404 Not Found` if not found

#### `PUT /api/bookmarks/[id]`

- **Body:**  
  Same as POST
- **Response:**  
  `200 OK` – Updated bookmark object

#### `DELETE /api/bookmarks/[id]`

- **Response:**  
  `200 OK` – `{ "message": "Bookmark deleted successfully" }`

---

### Metadata Endpoint

#### `GET /api/metadata?url=<url>`

- **Description:** Fetches title, description, and favicon for a given URL.
- **Response:**  
  ```json
  {
    "title": "string",
    "description": "string",
    "favicon": "string"
  }
  ```

---

## Sample cURL Requests

**Create a note:**
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"Hello world!","tags":["test"],"is_favorite":false}'
```

**Get all bookmarks (favorites only):**
```bash
curl "http://localhost:3000/api/bookmarks?favorites=true"
```

**Update a bookmark:**
```bash
curl -X PUT http://localhost:3000/api/bookmarks/<id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","url":"https://example.com","tags":["updated"],"is_favorite":true}'
```

**Delete a note:**
```bash
curl -X DELETE http://localhost:3000/api/notes/<id>
```

---

## Skills This Project Demonstrates

- REST API design & data validation
- Error handling and status codes
- React (Next.js) routing, state, and hooks
- Tailwind CSS for modern, responsive UI
- Clean code, modular structure, and type safety
- Real-world data modeling with Supabase

---

**Enjoy using NoteMark!**
