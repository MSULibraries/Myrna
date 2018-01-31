# Myrna Colley Lee Costume Collection

The Myrna costume website allows users to browse costume pieces and learn more about actual pieces of the Myrna Colley Lee costume collection. User accounts can get approved so that they can rent pieces from the collection.

## Contents

* [Functionality](#functionality)
* [Setup](#setup)
* [Technology](#technology)
* [Clothing](#clothing-types)

## [Functionality](#functionality)

* **User Accounts**

  * Users can create accounts and have a persisted experience within the app

* **Browse Costumes**

  * None Auth'd users can still browse costumes

* **Cart**

  * There is a cart system that will allow users to add product to cart. The cart will ignore duplicate entries.

    * Flow

      1. Go to `/products`
      1. Add Products to Cart (_Must be signed in_)
      1. Go to `/cart`

    * **Submit Order** - A user can submit the items in their cart to be ordered. This will create an entry to be approved by a maintainer.

      * Flow

        1. Click Submit Order
        1. Pick an address to ship to
        1. Select the date that the shipment needs to arrive by
        1. Select the date that the shipment will be shipped back by
        1. Enter any 'Special Instructions' if needed
        1. Select whether the order needs to be picked up or shipped

    * **Create a Show** - Creating a show saves all of the product id's in a user's cart as a show. This will allows users who run similar shows to easily pull costumes between each show.

      * Flow
        1. Click 'Create a Show'
        1. Enter the name of the show

    * **Pull a Show** - Pulls all product Id's from saved 'show', clears the cart, and then adds those product Id's to the cart.
      * Flow
        1. Click 'Pull a Show'
        1. Select a Show From the Dropdown
        1. Click 'Pull Show'

  * **Order**

    * A user can view different aspects of their current or previous orders such as products from that order, when the order was placed, what address the order was sent to, and the status of each order.

    * **Statuses** - There are various different 'statuses' of orders. Below are explainations of what each mean.

      * **Active** - The order has been paid for.
      * **Approved** - The order has been approved and is availible for purchase. Once approved, a customer will have the option to 'buy' the order. When a user clicks 'Buy' they will receive a link that will expire in 5 minutes. When they visit the link, they will be sent to the payment system. After completing their payment, they will be redirected back to a success page. This page will validate the response from the payment system. If valid, the order's shipment will be bought and started.
      * **Cancelled** - _Not in use_
      * **Complete** - The order has shipped, returned, and processed
      * **Delivered** - The shipment has reached it's destination. This is handled by am [EasyPost Webhook](https://www.easypost.com/webhooks-guide.html)
      * **Un-Approved** - The order has been made, but has not been approved by a maintainer

    * **Re-Order** - A user has an option to re order a previous order. Once a user clicks an order 'Re-Order' button, it will clear the user's cart and then add that order's products to the cart.

* **EasyPost Shipping** - We are using the [EasyPost API](https://www.easypost.com/) to handle shipping. EasyPost provides a [facade](https://en.wikipedia.org/wiki/Facade_pattern) for other shipping APIs allowing us to interface with EasyPost and then letting EasyPost translate what we want to other shipping APIs. After signing up for an account, EasyPost will give you a production key and a test key. While developing, we will use the test key to make fake shipments.

## [Setup](#setup)

* Install [NodeJS](https://nodejs.org/en/)
* Install [Meteor](https://www.meteor.com/install)
* Clone Code & Change to that directory
* Install Dependencies _(command: `npm i`)_
* Create a `settings.json` in the root of the folder
* Example

  ```json
  {
    "public": {
      "EASYPOST_TEST_API_KEY": "",
      "baseUrl": "",
      "siteEmail": ""
    },
    "private": {
      "payment": {
        "endpoint": "",
        "orderType": "",
        "paymentMethod": "",
        "redirectUrl": "",
        "redirectUrlParameters": "",
        "secret": "",
        "prod": {
          "endpoint": "",
          "orderType": "",
          "paymentMethod": "",
          "redirectUrl": "",
          "redirectUrlParameters": "",
          "secret": "s"
        }
      }
    }
  }
  ```
* Set Up Database
  1. Install [MongoDB](https://www.mongodb.com/)
  1. Download [itemDesc.json](https://raw.githubusercontent.com/MSULibraries/Myrna/240256e97d620fe68632f9298cf19b68efe30519/itemDesc.json)
  1. Start Myrna (`meteor`)
  1. Run: `mongoimport -h localhost:3001 -d meteor -c itemDesc --drop --file C://.../.../PATH_TO_ITEMDESC.JSON/itemDesc.json`
    * Env Var Note: Make sure MONGO_URL env variable is **NOT** set.
    * mongoimport Note: mongoimport may not be on your PATH so you may have to navigate to the folder where it is installed and run the command or add it to your PATH
    
* Add Product Images
  1. [Get Images From Master Branch](https://github.com/MSULibraries/Myrna/tree/master/public/images/clothing)
  2. Change to develp, *Or any branch that is a descendant of `develop`*
  3. Put the `clothing/` folder in `public/images`
    * We are ignoring clothing images in develop to keep the src code small. 
    * Please **Do Not** commit images into the develop branch
 
  
    
* Start Server _(command: `meteor --settings settings.json`)_

## [Technology](#technology)

* [Meteor](https://www.meteor.com/) - is a full stack javascript framework. It provides a view layer and a database with controllers in the middle. It also provides user accounts easily. If you are new to Meteor, the [Meteor React Tutorial](https://www.meteor.com/tutorials/react/creating-an-app) is a good place to start. You can learn most of what you need from it.

* [ReactJS](https://reactjs.org/) - is used for the view layer of the application.

* [MongoDB](https://www.mongodb.com/) - is used for the database. You do not have to interface much with the database directly. `imports/api` provides the interface for the application to the db.

### [Clothing Types](#clothing-types)

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
