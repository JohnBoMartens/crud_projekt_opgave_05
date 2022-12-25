# Hjemme Opgave.

Vi skal lave et endpoint som opretter et produkt.
Vi skal bruge postman til at teste undervejs.

1. Opret et products endpoint i server.js
    1. Det skal være et POST.
    2. Det skal være til stien /products/

2. Lige som vi behandler alle vores brugerer i users.js filen, opret nu en "products.js" fil.
    1. Skab et "products = {}"" modul og ekspotér det, lige som i users.js.
    2. Lav en "create(payload,callback)"" metode vi kan kalde fra server endpointet. (Lige som users.registerUser)



Create Metoden i products.js
```JavaScript
products.create = (payload, callback) => {

    console.log('payload fra clienten', payload);
    callback(200, {'message' : 'Nyt produkt er oprettet'})
            
};
```

3. Her efter kan vi lave endpointet i server.js færdig - så det ender med at se således ud.

```JavaScript
expressServer.post('/products/', (req, res) => {

    console.log('Product Body Payload', req.body)

    products.create(req.body, (code, returnObj) => {
        
        res.setHeader('Content-Type', 'application/json');
        res.status(code);
        res.send(returnObj);

    });
});
```

4. Åbn postman, og kald dit endpoint http://localhost:3000/products/ som POST med et body objekt f.eks.

```
{
    "title" : "ABC",
    "price" : 150
}
```

Hvis alt er som forventet skulle der gerne komme vores response besked i postman og en log besked på serveren hvor vi kan se vores payload.

5. Nu vil jeg anbefale at vi lave en MogoDB model, lige som user, men vi kalder den product.model.js.
6. I laver en model der i første omgang indeholder title og pris som ovenfor.
7. Efterlign den kode vi allerede har og lav funktionaliteten der gemme i mongoDB.
8. Herfra bestemmer i selv hvor langt i vil gå, men det vil være fedt hvis i lave et GET endpont til at hente de produkter i laver. Og i behøver bare at bruge postman, i behøver ikke lave client html. Det er en ren server opgave. (men i må meget gerne :o)

Produkt Objektet i ultimativt skal gemme.
```
{
    "title" : "All purpose balm",
    "price" : 169,
    "recommended" : true,
    "image" : "placeholder.png",
    "discountInPercent" : 0
}
```



God Arbejdslyst - og giv den nu en skalle :)

TEst Test Test