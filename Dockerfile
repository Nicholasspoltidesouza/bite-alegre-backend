FROM node:20

WORKDIR /app

# Copy package files and install deps
COPY package.json package-lock.json ./
# Copy the Prisma schema first
COPY prisma ./prisma
RUN npm install


# Then copy the rest
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start in dev mode
CMD ["npm", "run", "dev"]