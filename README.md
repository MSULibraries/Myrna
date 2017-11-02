# Myrna Colley Lee Costume Collection

The Myrna costume website allows users to browse costume pieces and learn more about actual pieces of the Myrna Colley Lee costume collection. User accounts can get approved so that they can rent pieces from the collection.

## Functionality

* **User Accounts**
  * Users can create accounts and have a persisted experience within the app
* **Browse Costumes**
  * None Auth'd users can still browse costumes
* **Add to Cart**
  * There is a cart system that will allow users to add product to cart. The cart will filter out duplicate entries. From the cart, you can either "Submit An Order" or "Create a Show."
    * **Submit Order** - A user can submit the items in their cart to be ordered. This will create an entry to be approved by a maintainer. Once approved, the order will be sent to [EasyPost](https://www.easypost.com/) where a shipment will be made. After the shipment has been made, we will store a tracking number, a tracking URL, and an image of the shipping label for that package.
    * **Create a Show** - Creating a show saves all of the product id's in a user's cart as a show. This will allows users who run similar shows to easily pull costumes between each show.
* **EasyPost Shipping** - We are using the [EasyPost API](https://www.easypost.com/) to handle shipping. EasyPost provides a [facade](https://en.wikipedia.org/wiki/Facade_pattern) for other shipping APIs allowing us to interface with EasyPost and then letting EasyPost translate what we want to other shipping APIs. After signing up for an account, EasyPost will give you a production key and a test key. While developing, we will use the test key to make fake shipments.

## Setup

* Install [NodeJS](https://nodejs.org/en/)
* Install [Meteor](https://www.meteor.com/install)
* Pull Code & Change to that directory
* Create a `settings.json` in the root of the folder
* Example
  ```json
  {
    "public": { "EASYPOST_TEST_API_KEY": "abcdef1234567890" }
  }
  ```
* Install Dependencies *(command: `npm i`)*
* Start Server *(command: `meteor --settings settings.json`)*

## Technology

* [Meteor](https://www.meteor.com/) - is a full stack javascript framework. It provides a view layer and a database with controllers in the middle. It also provides user accounts easily. If you are new to Meteor, the [Meteor React Tutorial](https://www.meteor.com/tutorials/react/creating-an-app) is a good place to start. You can learn most of what you need from it.

* [ReactJS](https://reactjs.org/) - is used for the view layer of the application.

* [MongoDB](https://www.mongodb.com/) - is used for the database. You do not have to interface much with the database directly. `imports/api` provides the interface for the application to the db.

### Clothing

The possible cltohing types are

* Apron
* Cape
* Dancewear
* Dress
* Jacket
* Jumpsuit
* Nightwear
* Pants
* Robe
* Shawl
* Shirt
* Shorts
* Skirt
* Suit
* Sweater
* Vest
