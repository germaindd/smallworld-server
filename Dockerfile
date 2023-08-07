# Dockerfile to create a local postgres db instance with configuration aligned with the 
# configuration for the local stage in code

# Use an official PostgreSQL image as the base
FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_DB smallworld
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD mypostgrespassword

# Expose the PostgreSQL port
EXPOSE 5432