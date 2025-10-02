
# BatchQuery Chatbot for Image Analysis

BatchQuery is a web-based application that allows users to upload images and ask questions about them. The backend processes the images and queries, returning insights or responses based on the uploaded content.

---

## Features

- **Image Upload**: Upload up to 4 images at a time for analysis.
- **Query Processing**: Ask questions related to the uploaded images.
- **Responsive Chat Interface**: Interactive chat interface for user-bot communication.
- **Light/Dark Theme**: Toggle between light and dark themes.

---

## Tech Stack

- **Frontend**: Vue 3, Tailwind CSS, DaisyUI
- **Backend**: Express.js, Multer, Sharp
- **Build Tool**: Vite
- **Styling**: SCSS with Tailwind and DaisyUI themes

---

## Installation

### Prerequisites

- **Node.js** (v16+)
- **npm** (v8+)

### Clone the Repository

```bash
git clone [https://github.com/your-username/batch-query.git](https://github.com/your-username/batch-query.git)
cd batch-query
````

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Open the app in your browser: `http://localhost:5173`

-----

## Usage

1.  Upload up to **4 images** using the file upload button.
2.  Type a question in the input field.
3.  Submit the query to receive insights about the uploaded images.

-----

## Project Structure

```
Batch-Query/
├── src/
│   ├── App.vue            # Main Vue component
│   ├── main.js            # Entry point for the app
│   ├── server.js          # Backend server for processing images
│   ├── assets/
│   │   └── styles/
│   │       ├── main.scss  # Main SCSS file
│   │       └── vendor/
│   │           ├── tailwind.css
│   │           └── daisyui.css
├── public/                # Static assets
├── package.json           # Project dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

-----

## API Endpoints

### `POST /api/process-images`

| Description | Processes uploaded images and returns responses. |
| :--- | :--- |

**Request Body**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `query` | `string` | The user's question. |
| `images` | `array` | Up to 4 image files. |

**Response Body**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `processedImages` | `array` | Details about the processed images and the chatbot response. |

-----

## Future Plans
The next major step is to integrate a robust language model, with the ChatGPT API planned to be added to enhance the query processing capabilities of the chatbot.

## Deployment 
This project is configured to deploy to GitHub Pages using a GitHub Actions workflow. Ensure the BASE_URL environment variable is set correctly in your workflow file.

⚠️ Important: Due to limitations with GitHub Pages, the backend server component of this application does not function when deployed. The backend must be run locally to process images and queries.

-----

## Scripts

  - `npm run dev`: Start the development server.
  - `npm run build`: Build the project for production.
  - `npm run preview`: Preview the production build.

-----

## License

This project is licensed under the **MIT License**.

-----

## Acknowledgments

  - Vue.js
  - Tailwind CSS
  - DaisyUI
  - Sharp
  - Express.js

