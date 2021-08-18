FROM node
LABEL authors="Zidane Zine eddine"
# update dependencies and install curl
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*
# Create app directory
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./ \
#     ./source ./

# This will copy everything from the source path 
# --more of a convenience when testing locally.
COPY . .
# update each dependency in package.json to the latest version
# IMPORTANT : remember to update dependencies in later versions
RUN npm install -g npm-check-updates \
    ncu -u \
    npm install \
    npm install express \
    npm install dotenv \
    npm install bcryptjs \
    npm install crypto \
    npm install jsonwebtoken \
    npm install mongoose \
    npm install morgan

# If you are building your code for production
RUN npm ci --only=production
# Bundle app source
COPY . /app
EXPOSE 5000
CMD [ "node", "index.js" ]