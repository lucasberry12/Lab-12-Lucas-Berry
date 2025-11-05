# Grocery List Web Application

Author: Lucas Berry

## Project Spec

For my final project in CS408, I am going to be creating a grocery list application. The application will be fairly simple, as the goal here is to provide customers
with a simple means of creating and modifying grocery lists without having to either create one in their notes app on their personal phone, or having to write one
down on paper physically. The audience for this application will be the general public, as essentially anyone will have a reason to be interested in an application like this.

The application will be built across three different pages, and will utilize two separate databases to hold the data needed for the application to operate. The main page of the
application will be the actual list area. This page will contain the actual grocery list the user has created, including the item names and the amount of items the user specified that they wanted to purchase. The items will be sorted by item category by default, so for example milk and butter will both be listed together as they are both dairy applications, however, the user will also have the option to sort the list alphabetically if they wish to. This will not be enabled by default, however, since it is less intuitive. Next to each list item will be a checkbox to be marked if the user has grabbed the item from the store, and a delete button which will remove the item from the list altogether.

The second page of the application will be a more difficult one to implement. This page will act as essentially a search page, where the user will be able to search through a database of food items. The search results will display the food name and price on the page, and will allow the user to add the item, and the specific amount, to their grocery list. This page is essentially where the user will be adding items to the list. This will require the creation of a database which can hold item names and price per item so the user can view that information.

The final page of the application will be a favorites page. If the user frequently purchases the same item, they will have the option in the main list area or the search area to favorite an item, which will result in it appearing on the favorites page for the user to see. The items here will be pulled from the full list database, as I will add a favorited boolean to check which items to display.

As I said before, there will be two databases in use for this project. My idea is to have the overall items database include three variables, being the name of the item, the price of the item, and whether it is a favorite or not. For the list database, this should only need to include the item name and the quantity of the item. However, I could also add a price for the total amounts of items there, so the total price of the shopping cart can be displayed to the user as well. That will be stretch goal for if the project goes very well. Another stretch goal I have is to add images next to each item in the search page. If I can manage to get everything working, I will try to add this later on to improve the look of the site.

## Project Wireframe

TODO: Replace the wireframe below with you own design.

![wireframe](wireframe-example.png)
