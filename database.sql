CREATE DATABASE internship_db;

CREATE TABLE internships (
    id SERIAL PRIMARY KEY,
    company VARCHAR(255),
    location VARCHAR(255),
    industry VARCHAR(255),
    term VARCHAR(255),
    year INTEGER,
    major VARCHAR(255)
);