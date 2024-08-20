
# MERN Hotel Backend

A EXAMPLE backend solution for a Hotel Booking App.



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV`

`MONGO_URI`

`JWT_COOKIE_EXPIRES_IN`

`PORT`

`JWT_SECRET`

`JWT_EXPIRES_IN`

`JWT_COOKIE_EXPIRES_IN`

`CLOUDINARY_CLOUD_NAME`

`CLOUDINARY_API_KEY`

`CLOUDINARY_API_SECRET`

`STRIPE_API_KEY`

`FRONTEND_URL`


## Backend Configuration
**1. MongoDB Setup**
* Sign up for an account at MongoDB Atlas.
* Create a new cluster and follow the instructions to set up a new database.
* Once set up, obtain your MongoDB connection string and add it to the MONGO_URI variable in your .env files.

**2. Cloudinary Setup**
* Create an account at Cloudinary.
* Navigate to your dashboard to find your cloud name, API key, and API secret.
* Add these details to the respective CLOUDINARY_* variables in your .env files.

**3. Stripe Setup**
* Sign up for a Stripe account at Stripe.
* Find your API keys in the Stripe dashboard.
* Add your Stripe API key to the STRIPE_API_KEY variable in your .env files.

**4. JWT_SECRET**
* This just needs to be any long, random string. You can google "secret key generator".

**5. Frontend URL**
* The FRONTEND_URL should point to the URL where your frontend application is running (typically http://localhost:3000 if you're running it locally).


  
## Run Locally

Clone the project

```bash
  git clone https://github.com/Harun-techie53/mern-hotel-backend.git
```

Go to the project directory

```bash
  cd mern-hotel-backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

