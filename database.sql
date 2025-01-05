CREATE DATABASE internship_db;

CREATE TABLE internships (
    id SERIAL PRIMARY KEY,
    moreInfo VARCHAR(255),
    company VARCHAR(255),
    location VARCHAR(255),
    industry VARCHAR(255),
    term VARCHAR(255),
    year INTEGER,
    major VARCHAR(255),
    CONSTRAINT unique_internship UNIQUE (company, location, industry, term, year, major)
);
