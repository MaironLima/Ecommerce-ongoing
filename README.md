
# Ecommerce Ongoing

This project is an e-commerce application composed of a back-end (Node.js, TypeScript, Prisma) and a front-end (React, Vite, TypeScript, Tailwind CSS).

## Project Structure

```
Ecommerce-ongoing/
├── back-end/      # API, database, authentication, business logic
└── front-end/     # User interface, React SPA
```

## Technologies Used

### Back-end
- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL (suggested)
- Nodemon

### Front-end
- React
- Vite
- TypeScript
- Tailwind CSS

## How to Run the Project

### Prerequisites
- Node.js >= 18
- npm or yarn
- PostgreSQL database (or another, as configured in Prisma)

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd Ecommerce-ongoing
```

#### 2. Install dependencies
```bash
cd back-end
npm install
cd ../front-end
npm install
```

#### 3. Configure environment variables
- Create a `.env` file in `back-end/` with your database and other required settings.

#### 4. Run database migrations
```bash
cd back-end
npx prisma migrate dev
```

#### 5. Start the back-end
```bash
npm run dev
```

#### 6. Start the front-end
```bash
cd ../front-end
npm run dev
```

Access the front-end at [http://localhost:5173](http://localhost:5173) (or the port configured by Vite).

## Folder Structure

### back-end/
- `src/` - API source code
- `prisma/` - Database schema and migrations
- `global/` - Global types
- `imagens/` - Image uploads

### front-end/
- `src/` - React source code
- `public/` - Static files
- `lib/` - Utilities

## Useful Scripts

### Back-end
- `npm run dev` - Starts the server in development mode
- `npx prisma migrate dev` - Applies database migrations

### Front-end
- `npm run dev` - Starts the front-end in development mode

## Contribution

Pull requests are welcome! Feel free to open issues and suggest improvements.

## License

This project is licensed under the MIT License.
