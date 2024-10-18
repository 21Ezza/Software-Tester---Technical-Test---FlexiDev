require('dotenv').config(); 
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
let driver;

describe("Shoping Chart", function() {
    describe("Login", function() {

        before(async function() {
            driver = await new Builder()
                .forBrowser(process.env.BROWSER)
                .build();

            await driver.manage().window().maximize();
            await driver.get(process.env.URL);
        });

        
        after(async function() {
            await driver.sleep(1500);
            await driver.quit();
        });

        
        it("As a user, I can't login with invalid credentials", async function() {
            this.timeout(10000);
            await driver.findElement(By.name('user-name')).sendKeys('invalidUsername');
            await driver.findElement(By.name('password')).sendKeys('invalidPassword', Key.RETURN);

            
            let errorMessageElement = await driver.wait(until.elementLocated(By.css('h3[data-test="error"]')), 10000);
            let errorMessage = await errorMessageElement.getText();
            
            
            assert(errorMessage.includes("Epic sadface: Username and password do not match any user in this service"), 
           "Error message is incorrect or not displayed");
        });

        it("As user, i can't login without username", async function() {
            this.timeout(10000);
            await driver.navigate().refresh();
            await driver.findElement(By.name('password')).sendKeys('invalidPassword');
            driver.findElement(By.xpath('//input[@id="login-button"]')).click();


            await driver.sleep(1500);
            let errorMessageElement = await driver.wait(until.elementLocated(By.css('h3[data-test="error"]')), 10000);
            let errorMessage = await errorMessageElement.getText();
            
            assert(errorMessage.includes("Epic sadface: Username is required"), 
            "Error message is incorrect or not displayed");
        });

        it("As user, i can't login without password", async function() {
            this.timeout(10000);
            await driver.navigate().refresh();
            await driver.findElement(By.name('user-name')).sendKeys('invalidUsername');
            driver.findElement(By.xpath('//input[@id="login-button"]')).click();

            let errorMessageElement = await driver.wait(until.elementLocated(By.css('h3[data-test="error"]')), 10000);
            let errorMessage = await errorMessageElement.getText();
            
            
            assert(errorMessage.includes("Epic sadface: Password is required"),
           "Error message is incorrect or not displayed");
        });

        
        it("As a user, I can login with valid credentials", async function() {
            this.timeout(10000);
            await driver.navigate().refresh();
            await driver.findElement(By.name('user-name')).sendKeys(process.env.NAME);
            await driver.findElement(By.name('password')).sendKeys(process.env.PASSWORD, Key.RETURN);
            
            let productsHeaderElement = await driver.wait(until.elementLocated(By.css('span[data-test="title"]')), 10000);
            let productsHeader = await productsHeaderElement.getText();
            assert.strictEqual(productsHeader, "Products", "User is not logged in successfully or header text is incorrect");
        });
    });

    describe("Shopping Cart Functionality", function() {

        before(async function() {
            driver = await new Builder()
                .forBrowser(process.env.BROWSER)
                .build();

            await driver.manage().window().maximize();
            await driver.get(process.env.URL);
        });

        
        after(async function() {
            await driver.sleep(1500);
            await driver.quit();
        });

        it("Add Item", async function() {
            
            this.timeout(10000);
            await driver.findElement(By.name('user-name')).sendKeys(process.env.NAME);
            await driver.findElement(By.name('password')).sendKeys(process.env.PASSWORD, Key.RETURN);
            

            const itemIDs = ['item_3_title_link', 'item_4_title_link', 'item_5_title_link','item_2_title_link']; 

            for (const itemId of itemIDs) {
                
                let itemTitleLink = await driver.wait(until.elementLocated(By.id(itemId)), 10000);
                let addToCartButton = await itemTitleLink.findElement(By.xpath("./ancestor::div[@class='inventory_item']//button[contains(@name, 'add-to-cart')]"));
                await addToCartButton.click();
                
                await driver.sleep(500);
            }

        });

        it("Remove Item", async function() {
            
            this.timeout(10000);
            const RemoveIDs = ['item_4_title_link']; 

            for (const removeIDs of RemoveIDs) {
                
                let itemTitleLink = await driver.wait(until.elementLocated(By.id(removeIDs)), 10000);
                let addToCartButton = await itemTitleLink.findElement(By.xpath("./ancestor::div[@class='inventory_item']//button[contains(@name, 'remove-sauce')]"));
                await addToCartButton.click();   
                await driver.sleep(500);
            }
            

        });

        it("Checkout", async function() {

            this.timeout(10000);
            
            
            let shoppingCartButton = await driver.wait(until.elementLocated(By.css('a[data-test="shopping-cart-link"]')), 10000);
            await shoppingCartButton.click();

            await driver.sleep(1500);   

            let checkoutButton = await driver.wait(until.elementLocated(By.id('checkout')), 10000);
            await checkoutButton.click();

            await driver.findElement(By.name('firstName')).sendKeys(process.env.firstname);
            await driver.findElement(By.name('lastName')).sendKeys(process.env.lastname);
            await driver.findElement(By.name('postalCode')).sendKeys(process.env.postalCode);

            let continueButton = await driver.wait(until.elementLocated(By.id('continue')), 10000);
            await continueButton.click();

            await driver.sleep(1500); 

            let finishButton = await driver.wait(until.elementLocated(By.id('finish')), 10000);
            await finishButton.click();

            await driver.sleep(1500); 

            let header = await driver.wait(until.elementLocated(By.xpath('//h2[@data-test="complete-header"]')), 10000);
            let headerText = await header.getText();
    
            assert.strictEqual(headerText, 'Thank you for your order!');

            let backButton = await driver.wait(until.elementLocated(By.id('back-to-products')), 10000);
            await backButton.click();


        });
    });

        describe("Sorting name and price", function() {

            before(async function() {
                driver = await new Builder()
                    .forBrowser(process.env.BROWSER)
                    .build();
    
                await driver.manage().window().maximize();
                await driver.get(process.env.URL);
    
            });
    
            
            after(async function() {
                await driver.sleep(1500);
                await driver.quit();
            });
    
            it("Sort By A to Z", async function() {
                this.timeout(100000);
                await driver.findElement(By.name('user-name')).sendKeys(process.env.NAME);
                await driver.findElement(By.name('password')).sendKeys(process.env.PASSWORD, Key.RETURN);
                
                let dropdown = await driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div[2]/div/span/select'));
    
                await dropdown.click();
    
                let option = await driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div[2]/div/span/select/option[1]'));
                await option.click();
                await driver.sleep(500)
    
                let productElements = await driver.findElements(By.className('inventory_item_name'));
                let productNames = [];
    
                for (let productElement of productElements) {
                    productNames.push(await productElement.getText());
                }
                let sortedProductNames = [...productNames].sort();
    
                assert.deepStrictEqual(productNames, sortedProductNames, "The products are not sorted from A to Z");
    
            });
    
            it("Sort By Z to A", async function() {
                this.timeout(10000);
                let dropdown = await driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div[2]/div/span/select'));
                await dropdown.click();
    
                let option = await driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div[2]/div/span/select/option[2]'));
                await option.click();
                await driver.sleep(500)
    
                let productElements = await driver.findElements(By.className('inventory_item_name'));
                let productNames = [];
    
                for (let productElement of productElements) {
                    productNames.push(await productElement.getText());
                }
    
                let sortedProductNames = [...productNames].sort().reverse();
    
                
                assert.deepStrictEqual(productNames, sortedProductNames, "The products are not sorted from Z to A");
    
            });
    
            it("Price (Low to High)", async function() {
                this.timeout(10000);
                let dropdown = await driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div[2]/div/span/select'));
                await dropdown.click();
    
                let option = await driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div[2]/div/span/select/option[3]'));
                await option.click();
                await driver.sleep(500)
    
                let priceElements = await driver.findElements(By.className('inventory_item_price'));
                let prices = [];
    
                
                for (let priceElement of priceElements) {
                    let priceText = await priceElement.getText(); 
                    let priceValue = parseFloat(priceText.replace('$', '')); 
                    prices.push(priceValue);
                }
    
                
                let sortedPrices = [...prices].sort((a, b) => a - b);
    
                
                assert.deepStrictEqual(prices, sortedPrices, "The prices are not sorted from Low to High");
            });
    
            it("Price (High to Low)", async function() {
                this.timeout(10000);
                let dropdown = await driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div[2]/div/span/select'));
                await dropdown.click();

                let option = await driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div[2]/div/span/select/option[4]'));
                await option.click();
                await driver.sleep(500)
    
                let priceElements = await driver.findElements(By.className('inventory_item_price'));
                let prices = [];
    
                
                for (let priceElement of priceElements) {
                    let priceText = await priceElement.getText(); 
                    let priceValue = parseFloat(priceText.replace('$', '')); 
                    prices.push(priceValue);
                }
    
                let sortedPrices = [...prices].sort((a, b) => b - a);
    
                assert.deepStrictEqual(prices, sortedPrices, "The prices are not sorted from High to Low");
    
            });
        });

});
