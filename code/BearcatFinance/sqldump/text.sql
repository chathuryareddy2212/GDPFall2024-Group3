SELECT * FROM bearcat_finance_app.expenses;


INSERT INTO Expenses (TransactionID, CategoryID, GoalID, BudgetID, Amount, Description, TransactionType, Merchandise, UserID, Date, createdAt, updatedAt) 
VALUES 
-- Debit Transactions (Money Going Out)
(NULL, 7, NULL, NULL, 60.00, 'Grocery shopping', 'Debit', 'Walmart', 1, NOW(), NOW(), NOW()),
(NULL, 9, NULL, NULL, 25.00, 'Taxi fare', 'Debit', 'Uber', 1, NOW(), NOW(), NOW()),
(NULL, 3, NULL, NULL, 50.00, 'Concert ticket', 'Debit', 'Live Nation', 1, NOW(), NOW(), NOW()),
(NULL, 4, NULL, NULL, 120.00, 'Internet bill', 'Debit', 'Comcast', 1, NOW(), NOW(), NOW()),
(NULL, 5, NULL, NULL, 80.00, 'Dentist appointment', 'Debit', 'Dental Care', 1, NOW(), NOW(), NOW()),
(NULL, 18, NULL, NULL, 45.00, 'Gym membership', 'Debit', 'Anytime Fitness', 1, NOW(), NOW(), NOW()),
(NULL, 10, NULL, NULL, 200.00, 'Rent payment', 'Debit', 'Landlord', 1, NOW(), NOW(), NOW()),
(NULL, 8, NULL, NULL, 35.00, 'Dinner with friends', 'Debit', 'Olive Garden', 1, NOW(), NOW(), NOW()),
(NULL, 6, NULL, NULL, 90.00, 'New running shoes', 'Debit', 'Nike Store', 1, NOW(), NOW(), NOW()),
(NULL, 9, NULL, NULL, 30.00, 'Car wash', 'Debit', 'Quick Clean', 1, NOW(), NOW(), NOW()),
(NULL, 4, NULL, NULL, 150.00, 'Weekend hotel stay', 'Debit', 'Marriott', 1, NOW(), NOW(), NOW()),
(NULL, 4, NULL, NULL, 55.00, 'Gas refill', 'Debit', 'Shell', 1, NOW(), NOW(), NOW()),
(NULL, 16, NULL, NULL, 20.00, 'Monthly magazine subscription', 'Debit', 'National Geographic', 1, NOW(), NOW(), NOW()),
(NULL, 4, NULL, NULL, 110.00, 'Home electricity bill', 'Debit', 'Utility Company', 1, NOW(), NOW(), NOW()),
(NULL, 7, NULL, NULL, 10.00, 'Coffee', 'Debit', 'Starbucks', 1, NOW(), NOW(), NOW()),
(NULL, 16, NULL, NULL, 50.00, 'Streaming subscription', 'Debit', 'Netflix', 1, NOW(), NOW(), NOW()),
(NULL, 6, NULL, NULL, 180.00, 'Gaming console', 'Debit', 'GameStop', 1, NOW(), NOW(), NOW()),
(NULL, 2, NULL, NULL, 12.00, 'Parking fee', 'Debit', 'City Parking', 1, NOW(), NOW(), NOW()),
(NULL, 12, NULL, NULL, 40.00, 'Books for school', 'Debit', 'Barnes & Noble', 1, NOW(), NOW(), NOW()),
(NULL, 17, NULL, NULL, 95.00, 'Gift shopping', 'Debit', 'Amazon', 1, NOW(), NOW(), NOW()),

-- Credit Transactions (Money Coming In)
(NULL, 14, NULL, NULL, 1500.00, 'Monthly salary', 'Credit', 'Company Payroll', 1, NOW(), NOW(), NOW()),
(NULL, 14, NULL, NULL, 200.00, 'Freelance project payment', 'Credit', 'Upwork', 1, NOW(), NOW(), NOW()),
(NULL, 14, NULL, NULL, 50.00, 'Cashback reward', 'Credit', 'Bank Promotion', 1, NOW(), NOW(), NOW()),
(NULL, 13, NULL, NULL, 300.00, 'Stock dividends', 'Credit', 'Robinhood', 1, NOW(), NOW(), NOW()),
(NULL, 12, NULL, NULL, 75.00, 'Selling old textbooks', 'Credit', 'eBay', 1, NOW(), NOW(), NOW()),
(NULL, 14, NULL, NULL, 600.00, 'Bonus from work', 'Credit', 'Company HR', 1, NOW(), NOW(), NOW()),
(NULL, 17, NULL, NULL, 20.00, 'Refund from canceled order', 'Credit', 'Amazon', 1, NOW(), NOW(), NOW()),
(NULL, 14, NULL, NULL, 100.00, 'Reimbursement for work expenses', 'Credit', 'Employer', 1, NOW(), NOW(), NOW()),
(NULL, 15, NULL, NULL, 90.00, 'Selling handmade crafts', 'Credit', 'Etsy', 1, NOW(), NOW(), NOW()),
(NULL, 17, NULL, NULL, 15.00, 'Birthday gift money', 'Credit', 'Family', 1, NOW(), NOW(), NOW());

INSERT INTO Expenses (TransactionID, CategoryID, GoalID, BudgetID, Amount, Description, TransactionType, Merchandise, UserID, Date, createdAt, updatedAt) 
VALUES 
-- Debit Transactions (Money Going Out)
(NULL, 7, NULL, NULL, 65.00, 'Grocery shopping', 'Debit', 'Walmart', 1, NOW(), NOW(), NOW()),
(NULL, 9, NULL, NULL, 30.00, 'Taxi fare', 'Debit', 'Uber', 1, NOW(), NOW(), NOW()),
(NULL, 3, NULL, NULL, 55.00, 'Concert ticket', 'Debit', 'Live Nation', 1, NOW(), NOW(), NOW()),
(NULL, 4, NULL, NULL, 125.00, 'Internet bill', 'Debit', 'Comcast', 1, NOW(), NOW(), NOW()),
(NULL, 5, NULL, NULL, 90.00, 'Dentist appointment', 'Debit', 'Dental Care', 1, NOW(), NOW(), NOW()),
(NULL, 18, NULL, NULL, 50.00, 'Gym membership', 'Debit', 'Anytime Fitness', 1, NOW(), NOW(), NOW()),
(NULL, 10, NULL, NULL, 205.00, 'Rent payment', 'Debit', 'Landlord', 1, NOW(), NOW(), NOW()),
(NULL, 8, NULL, NULL, 40.00, 'Dinner with friends', 'Debit', 'Olive Garden', 1, NOW(), NOW(), NOW()),
(NULL, 6, NULL, NULL, 95.00, 'New running shoes', 'Debit', 'Nike Store', 1, NOW(), NOW(), NOW()),
(NULL, 9, NULL, NULL, 35.00, 'Car wash', 'Debit', 'Quick Clean', 1, NOW(), NOW(), NOW()),
(NULL, 4, NULL, NULL, 160.00, 'Weekend hotel stay', 'Debit', 'Marriott', 1, NOW(), NOW(), NOW()),
(NULL, 4, NULL, NULL, 60.00, 'Gas refill', 'Debit', 'Shell', 1, NOW(), NOW(), NOW()),
(NULL, 16, NULL, NULL, 25.00, 'Monthly magazine subscription', 'Debit', 'National Geographic', 1, NOW(), NOW(), NOW()),
(NULL, 4, NULL, NULL, 115.00, 'Home electricity bill', 'Debit', 'Utility Company', 1, NOW(), NOW(), NOW()),
(NULL, 7, NULL, NULL, 15.00, 'Coffee', 'Debit', 'Starbucks', 1, NOW(), NOW(), NOW()),
(NULL, 16, NULL, NULL, 55.00, 'Streaming subscription', 'Debit', 'Netflix', 1, NOW(), NOW(), NOW()),
(NULL, 6, NULL, NULL, 190.00, 'Gaming console', 'Debit', 'GameStop', 1, NOW(), NOW(), NOW()),
(NULL, 2, NULL, NULL, 18.00, 'Parking fee', 'Debit', 'City Parking', 1, NOW(), NOW(), NOW()),
(NULL, 12, NULL, NULL, 45.00, 'Books for school', 'Debit', 'Barnes & Noble', 1, NOW(), NOW(), NOW()),
(NULL, 17, NULL, NULL, 100.00, 'Gift shopping', 'Debit', 'Amazon', 1, NOW(), NOW(), NOW()),

-- Credit Transactions (Money Coming In)
(NULL, 14, NULL, NULL, 1600.00, 'Monthly salary', 'Credit', 'Company Payroll', 1, NOW(), NOW(), NOW()),
(NULL, 14, NULL, NULL, 250.00, 'Freelance project payment', 'Credit', 'Upwork', 1, NOW(), NOW(), NOW()),
(NULL, 14, NULL, NULL, 55.00, 'Cashback reward', 'Credit', 'Bank Promotion', 1, NOW(), NOW(), NOW()),
(NULL, 13, NULL, NULL, 350.00, 'Stock dividends', 'Credit', 'Robinhood', 1, NOW(), NOW(), NOW()),
(NULL, 12, NULL, NULL, 85.00, 'Selling old textbooks', 'Credit', 'eBay', 1, NOW(), NOW(), NOW()),
(NULL, 14, NULL, NULL, 650.00, 'Bonus from work', 'Credit', 'Company HR', 1, NOW(), NOW(), NOW()),
(NULL, 17, NULL, NULL, 25.00, 'Refund from canceled order', 'Credit', 'Amazon', 1, NOW(), NOW(), NOW()),
(NULL, 14, NULL, NULL, 120.00, 'Reimbursement for work expenses', 'Credit', 'Employer', 1, NOW(), NOW(), NOW()),
(NULL, 15, NULL, NULL, 95.00, 'Selling handmade crafts', 'Credit', 'Etsy', 1, NOW(), NOW(), NOW()),
(NULL, 17, NULL, NULL, 20.00, 'Birthday gift money', 'Credit', 'Family', 1, NOW(), NOW(), NOW()),
(NULL, 14, NULL, NULL, 230.00, 'Freelance work payment', 'Credit', 'Freelancer', 1, NOW(), NOW(), NOW()),
(NULL, 12, NULL, NULL, 110.00, 'Stock dividends', 'Credit', 'Robinhood', 1, NOW(), NOW(), NOW()),
(NULL, 16, NULL, NULL, 40.00, 'Digital magazine subscription', 'Credit', 'Apple News', 1, NOW(), NOW(), NOW()),
(NULL, 13, NULL, NULL, 300.00, 'Rental property income', 'Credit', 'Property Management', 1, NOW(), NOW(), NOW()),
(NULL, 15, NULL, NULL, 130.00, 'Online course refund', 'Credit', 'Udemy', 1, NOW(), NOW(), NOW()),
(NULL, 17, NULL, NULL, 75.00, 'Gift for friend', 'Credit', 'Amazon', 1, NOW(), NOW(), NOW()),
(NULL, 18, NULL, NULL, 50.00, 'Fitness competition prize', 'Credit', 'Fitness Center', 1, NOW(), NOW(), NOW()),
(NULL, 14, NULL, NULL, 800.00, 'End of project bonus', 'Credit', 'Freelancer', 1, NOW(), NOW(), NOW()),
(NULL, 16, NULL, NULL, 45.00, 'Streaming subscription', 'Credit', 'Hulu', 1, NOW(), NOW(), NOW()),
(NULL, 14, NULL, NULL, 60.00, 'Reimbursement for travel expenses', 'Credit', 'Company', 1, NOW(), NOW(), NOW()),
(NULL, 12, NULL, NULL, 125.00, 'Stock sale profit', 'Credit', 'Robinhood', 1, NOW(), NOW(), NOW()),
(NULL, 17, NULL, NULL, 40.00, 'Gift for family member', 'Credit', 'Etsy', 1, NOW(), NOW(), NOW()),
(NULL, 14, NULL, NULL, 1800.00, 'Salary bonus', 'Credit', 'Company Payroll', 1, NOW(), NOW(), NOW()),
(NULL, 14, NULL, NULL, 90.00, 'Freelance writing payment', 'Credit', 'Upwork', 1, NOW(), NOW(), NOW()),
(NULL, 13, NULL, NULL, 300.00, 'Stock dividend', 'Credit', 'Robinhood', 1, NOW(), NOW(), NOW()),
(NULL, 15, NULL, NULL, 70.00, 'Selling old books', 'Credit', 'eBay', 1, NOW(), NOW(), NOW()),
(NULL, 12, NULL, NULL, 110.00, 'Investment dividends', 'Credit', 'Fidelity', 1, NOW(), NOW(), NOW()),
(NULL, 14, NULL, NULL, 450.00, 'Freelance job payment', 'Credit', 'Freelancer', 1, NOW(), NOW(), NOW()),
(NULL, 18, NULL, NULL, 60.00, 'Fitness challenge reward', 'Credit', 'Fitness Center', 1, NOW(), NOW(), NOW()),
(NULL, 16, NULL, NULL, 50.00, 'Music streaming subscription', 'Credit', 'Spotify', 1, NOW(), NOW(), NOW()),
(NULL, 17, NULL, NULL, 85.00, 'Gift shopping for family', 'Credit', 'Amazon', 1, NOW(), NOW(), NOW());




