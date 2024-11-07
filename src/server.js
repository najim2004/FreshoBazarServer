// src/index.js

import express from "express";
import cors from "cors";
import { createApolloGraphQLServer } from "./graphql/index.js";
import { connectDB } from "./config/db.config.js";
import { config } from "./config/env.config.js";
// import helmet from 'helmet';
const init = async () => {
  const app = express();

  // Apply middleware
  app.use(cors());
  app.use(express.json());

  try {
    // Connect to MongoDB
    await connectDB();

    app.get("/", (req, res) => {
      res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GraphQL API Home</title>
        <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: 'Arial', sans-serif;
              background-color: #121212;
              color: #e0e0e0;
              text-align: center;
              display: flex;
              flex-direction: column;
              justify-content: center;
              min-height: 100vh;
              padding: 20px 20px 0;
            }
            header {
              background-color: #1e1e1e;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
            }
            h1 {
              margin: 0;
              font-size: 3em;
              letter-spacing: 1px;
              text-transform: uppercase;
              text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
            }
            main {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            h2 {
              font-size: 2.5em;
              margin: 20px 0;
              font-weight: 300;
            }
            p {
              font-size: 1.5em;
              margin: 10px 0;
              line-height: 1.5;
            }
            a {
              text-decoration: none;
              color: #ffffff;
              background-color: black;
              padding: 15px 25px;
              border-radius: 10px;
              transition: background-color 0.3s, transform 0.2s;
              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
              font-size: 1.2em;
              margin: 20px auto 0;
              max-width: 400px;
                
            }
            a:hover {
              opacity: 80%;
              transform: scale(1.05);
            }
            footer {
              color: #e0e0e0;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 10px;
            }
            .contact{
              display: flex; 
              justify-content: center;
              align-items: center;
              gap: 20px;
              width: 100%;
              margin: 20px 0 0;
            }
            .contact a {
              text-decoration: none;
              color: #ffffff;
              background-color: black;
              padding: 15px 25px;
              border-radius: 10px;
              transition: background-color 0.3s, transform 0.2s;
              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
              font-size: 1.2em;
              margin: 0;
              max-width: 400px;
            }
            .mt-40px{
              margin: 40px 0 0;
            }
        </style>
    </head>
    <body>
        <header>
            <h1>Welcome to Krishok Bolchi GraphQL Server</h1>
        </header>
        <main>
            <h2>Discover Powerful Data</h2>
            <p>Your journey to seamless data interactions starts here.</p>
            <p>Explore the capabilities of our GraphQL API to manage your data efficiently.</p>
            <a href="/graphql">Explore GraphQL API</a>
            <h2 class="mt-40px">Contact with Developer</h2>
            <div class="contact">
            <a href="https://najim-dev.vercel.app" target="_blank">Portfolio</a>
            <a href="https://github.com/najim2004" target="_blank">Github</a>
            <a href="https://linkedin.com/in/mohammad-najim2004" target="_blank">LinkedIn</a>
            <a href="https://facebook.com/najim2004" target="_blank">Facebook</a>
            </div>
        </main>
        <hr/>
        <footer>
            <p>&copy; 2024 Najim. All rights reserved.</p>
        </footer>
    </body>
    </html>
    `);
    });

    // Apply Apollo middleware
    app.use("/graphql", await createApolloGraphQLServer());

    app.listen(config.port, () =>
      console.log(`server listening on http://localhost:${config.port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

init();
