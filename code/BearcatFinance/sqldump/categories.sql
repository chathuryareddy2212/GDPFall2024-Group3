SELECT * FROM bearcat_finance_app.categories;

use bearcat_finance_app;
INSERT INTO Categories (name, description, createdAt, updatedAt)
VALUES 
('Food', 'Expenses related to food and household items', NOW(), NOW()),
('Travel', 'Public and private transportation costs', NOW(), NOW()),
('Entertainment', 'Movies, games, and leisure activities', NOW(), NOW()),
('Utilities', 'Electricity, water, and internet bills', NOW(), NOW()),
('Healthcare', 'Medical expenses including doctor visits and insurance', NOW(), NOW()),
('Shopping', 'General shopping expenses including clothes and accessories', NOW(), NOW()),
('Groceries', 'Everyday food and kitchen supplies', NOW(), NOW()),
('Dining Out', 'Restaurants, cafes, and fast food expenses', NOW(), NOW()),
('Transportation', 'Fuel, public transport, and ride-sharing costs', NOW(), NOW()),
('Housing', 'Rent, mortgage, and home-related expenses', NOW(), NOW()),
('Insurance', 'Health, auto, home, and other insurance costs', NOW(), NOW()),
('Education', 'School fees, books, and online courses', NOW(), NOW()),
('Investments', 'Stocks, bonds, and other financial investments', NOW(), NOW()),
('Savings', 'Money set aside for future needs', NOW(), NOW()),
('Debt Payments', 'Loan, credit card, and other debt repayments', NOW(), NOW()),
('Subscriptions', 'Streaming services, magazines, and software subscriptions', NOW(), NOW()),
('Gifts & Donations', 'Charity and presents for friends and family', NOW(), NOW()),
('Fitness', 'Gym memberships, sports equipment, and fitness classes', NOW(), NOW()),
('Electronics', 'Purchases related to gadgets, phones, and accessories', NOW(), NOW()),
('Personal Care', 'Salon, spa, skincare, and grooming expenses', NOW(), NOW());

Truncate table expenses;

