# ZenLeaderBoard
This Meteor application displays a list of bank transactions read from a JSON file in an HTML table.  Only logged-in clients have the ability to read and write to the Transactions database. This causes the HTML table to reactively update. Currently, any client may view, sort, and search for Transactions in the database. Sorting and Searching are performed by a specified criteria (account number, transaction code, base currency, etc.). Search is dynamic and uses Regular Expressions. 

Angular JS was used to implement the Searching and Sorting. Transactions are stored in a private JSON file which are then transferred to a Mongo Database on the server-side during startup. 
